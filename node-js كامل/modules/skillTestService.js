const crypto = require("crypto");
const { pickQuestions } = require("./skillQuestionBank");
const { translateQuestion } = require("./skillQuestionBank.en");
const {
  SKILL_TEST_QUESTION_COUNT,
  SKILL_TEST_PASS_PCT,
  SKILL_TEST_MIN_PASS_SCORE,
} = require("./skillTestRules");

const SESSION_TTL_SEC = 15 * 60; // 15 minutes per attempt
const SESSION_TTL_MS = SESSION_TTL_SEC * 1000;
const MAX_SESSIONS = 5000;

/* Server-side test sessions. The answer key never leaves the server —
   the client only receives questions and per-question correct/incorrect feedback. */
const sessions = new Map(); // token -> { userId, skill, answerKey, startedAt, checked: Map }

function cleanupSessions() {
  const now = Date.now();
  for (const [k, s] of sessions) {
    if (now - s.startedAt > SESSION_TTL_MS) sessions.delete(k);
  }
}

function getValidSession(sessionToken, userId, skill) {
  if (!sessionToken || typeof sessionToken !== "string") {
    return { error: "بيانات الاختبار غير مكتملة" };
  }
  if (sessions.size > 100) cleanupSessions();
  const session = sessions.get(sessionToken);
  if (!session) {
    return { error: "انتهت صلاحية جلسة الاختبار، أعد المحاولة" };
  }
  if (String(session.userId) !== String(userId)) {
    return { error: "جلسة اختبار غير صالحة" };
  }
  if (skill && skill.trim() !== session.skill) {
    return { error: "المهارة لا تطابق جلسة الاختبار" };
  }
  return { session };
}

function createSkillTestSession(jwtSecret, userId, skill) {
  const picked = pickQuestions(skill, SKILL_TEST_QUESTION_COUNT);
  if (!picked.length) {
    return { ok: false, error: "لا توجد أسئلة لهذه المهارة" };
  }

  // خلط الخيارات على السيرفر مع إعادة حساب موضع الإجابة الصحيحة —
  // حتى لا يكون للموضع الأصلي أي دلالة يعرفها العميل
  const shuffled = picked.map((q) => {
    const order = q.opts.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = crypto.randomInt(i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    // الترجمة الإنجليزية تُخلط بنفس الترتيب لتبقى مطابقة للخيار العربي
    const en = translateQuestion(q.q, skill.trim());
    return {
      q: q.q,
      opts: order.map((i) => q.opts[i]),
      ans: order.indexOf(q.ans),
      en: en ? { q: en.q, opts: order.map((i) => en.opts[i]) } : null,
    };
  });

  const answerKey = shuffled.map((q) => q.ans);
  const sessionToken = crypto.randomBytes(24).toString("hex");
  if (sessions.size >= MAX_SESSIONS) cleanupSessions();
  sessions.set(sessionToken, {
    userId: String(userId),
    skill: skill.trim(),
    answerKey,
    startedAt: Date.now(),
    checked: new Map(), // questionIndex -> { answer, correct }
  });

  const questions = shuffled.map(({ q, opts, en }) => {
    const item = { q, opts };
    if (en) item.en = en;
    return item;
  });


  return {
    ok: true,
    sessionToken,
    questions,
    total: questions.length,
    expiresInSec: SESSION_TTL_SEC,
  };
}

function gradeSkillTestSubmission(jwtSecret, userId, { sessionToken, answers, skill }) {
  if (!sessionToken || !Array.isArray(answers)) {
    return { ok: false, error: "بيانات الاختبار غير مكتملة" };
  }

  const got = getValidSession(sessionToken, userId, skill);
  if (got.error) return { ok: false, error: got.error };
  const session = got.session;

  const answerKey = session.answerKey || [];
  if (answers.length !== answerKey.length) {
    return { ok: false, error: "عدد الإجابات لا يطابق عدد الأسئلة" };
  }

  let score = 0;
  for (let i = 0; i < answerKey.length; i++) {
    const recorded = session.checked.get(i);
    if (recorded) {
      // Graded from the server-verified check; a client answer contradicting
      // its own recorded check counts as wrong.
      if (recorded.correct && Number(answers[i]) === recorded.answer) score++;
    } else {
      // Question never checked server-side (e.g. network failure): grade the
      // client answer as a single blind guess.
      const chosen = Number(answers[i]);
      if (Number.isInteger(chosen) && chosen >= 0 && chosen === Number(answerKey[i])) {
        score++;
      }
    }
  }

  const total = answerKey.length;
  const pct = Math.round((score / total) * 100);
  const passed = score >= SKILL_TEST_MIN_PASS_SCORE && pct >= SKILL_TEST_PASS_PCT;

  return {
    ok: true,
    skill: session.skill,
    score,
    total,
    pct,
    passed,
  };
}

function gradeSkillTestAnswer(jwtSecret, userId, { sessionToken, questionIndex, answer, skill }) {
  const got = getValidSession(sessionToken, userId, skill);
  if (got.error) return { ok: false, error: got.error };
  const session = got.session;

  const answerKey = session.answerKey || [];
  const index = Number(questionIndex);
  const chosen = Number(answer);
  if (!Number.isInteger(index) || index < 0 || index >= answerKey.length) {
    return { ok: false, error: "رقم السؤال غير صالح" };
  }
  if (!Number.isInteger(chosen) || chosen < 0) {
    return { ok: false, error: "الإجابة غير صالحة" };
  }

  // One graded check per question: re-checking the same answer returns the
  // recorded result, trying a different answer is rejected (blocks brute force).
  if (session.checked.has(index)) {
    const recorded = session.checked.get(index);
    if (recorded.answer !== chosen) {
      return { ok: false, error: "تم الإجابة على هذا السؤال بالفعل" };
    }
    return { ok: true, correct: recorded.correct };
  }

  const correct = chosen === Number(answerKey[index]);
  session.checked.set(index, { answer: chosen, correct });
  return { ok: true, correct };
}

module.exports = { createSkillTestSession, gradeSkillTestSubmission, gradeSkillTestAnswer };
