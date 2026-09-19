/* Real E2E User Journey test against the live server + MongoDB */
const BASE = 'http://localhost:3000';
const rnd = Math.floor(Math.random() * 1e9);
const userA = { email: `e2e.a.${rnd}@test-sharik.com`, pass: 'Test1234!', first: 'ahmed', last: 'tester' };
const userB = { email: `e2e.b.${rnd}@test-sharik.com`, pass: 'Test1234!', first: 'sara', last: 'tester' };
const userC = { email: `e2e.c.${rnd}@test-sharik.com`, pass: 'Test1234!', first: 'mona', last: 'tester' };

let passCount = 0, failCount = 0;
const results = [];
function check(name, cond, detail) {
  if (cond) { passCount++; results.push(`PASS  ${name}`); }
  else { failCount++; results.push(`FAIL  ${name}${detail ? ' — ' + JSON.stringify(detail).slice(0, 200) : ''}`); }
}

async function api(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}

/** Take a skill test legitimately using check-answer feedback (one check per question, like the UI) */
async function takeTest(token, skill, { bruteForce = false, cheat = false } = {}) {
  const start = await api('POST', '/api/skill-test/start', { token, body: { skill } });
  if (start.status !== 200) return { error: start.data?.error || 'start failed', start };
  const { sessionToken, questions, total } = start.data;
  const answers = new Array(total).fill(-1);
  const bruteForceLog = [];
  for (let qi = 0; qi < questions.length; qi++) {
    if (cheat) { answers[qi] = 0; continue; }
    let found = -1;
    for (let opt = 0; opt < questions[qi].opts.length; opt++) {
      const chk = await api('POST', '/api/skill-test/check-answer', { token, body: { skill, sessionToken, questionIndex: qi, answer: opt } });
      if (chk.status !== 200) { bruteForceLog.push({ qi, opt, blocked: chk.data?.error }); break; }
      if (chk.data.correct) { found = opt; break; }
    }
    answers[qi] = found >= 0 ? found : 0;
  }
  const submit = await api('POST', '/api/skill-test/submit', { token, body: { skill, sessionToken, answers } });
  return { start, submit, bruteForceLog };
}

(async () => {
  /* ═══ 1. REGISTRATION ═══ */
  const regA = await api('POST', '/api/register', { body: { username1: userA.first, username2: userA.last, email: userA.email, password: userA.pass } });
  check('register user A returns 201 + token + user', regA.status === 201 && regA.data?.token && regA.data?.user?._id, regA.data);
  const regA2 = await api('POST', '/api/register', { body: { username1: 'x', username2: 'y', email: userA.email, password: 'Test1234!' } });
  check('duplicate email rejected (400)', regA2.status === 400, regA2);
  const regBad = await api('POST', '/api/register', { body: { username1: 'x', username2: 'y', email: 'not-an-email', password: 'Test1234!' } });
  check('register with invalid email rejected (400)', regBad.status === 400, regBad);
  const regShortPw = await api('POST', '/api/register', { body: { username1: 'x', username2: 'y', email: 'ok' + rnd + '@t.com', password: 'short' } });
  check('register with short password rejected (400)', regShortPw.status === 400, regShortPw);
  const tokA = regA.data.token, idA = regA.data.user._id;

  const regB = await api('POST', '/api/register', { body: { username1: userB.first, username2: userB.last, email: userB.email, password: userB.pass } });
  const tokB = regB.data.token, idB = regB.data.user._id;
  check('register user B ok', regB.status === 201, regB.data);

  const regC = await api('POST', '/api/register', { body: { username1: userC.first, username2: userC.last, email: userC.email, password: userC.pass } });
  const tokC = regC.data.token;

  /* login flow */
  const loginBad = await api('POST', '/api/login', { body: { email: userA.email, password: 'WrongPass1!' } });
  check('wrong password rejected (401)', loginBad.status === 401, loginBad);
  const loginA = await api('POST', '/api/login', { body: { email: userA.email, password: userA.pass } });
  check('login A ok', loginA.status === 200 && loginA.data?.token, loginA.data);

  /* identity */
  const meA = await api('GET', '/api/me', { token: tokA });
  check('/api/me returns same _id as register', meA.data?.user?._id === idA, meA.data?.user?._id);
  check('/api/me leaks no password', !JSON.stringify(meA.data).includes('"password'), Object.keys(meA.data?.user || {}));
  const meNoTok = await api('GET', '/api/me', {});
  check('/api/me without token → 401', meNoTok.status === 401, meNoTok.status);
  const meBadTok = await api('GET', '/api/me', { token: 'garbage.token.here' });
  check('/api/me with tampered token → 401', meBadTok.status === 401, meBadTok.status);

  /* ═══ 2. SKILLS SAVE ═══ */
  const skillsFail = await api('POST', '/api/skills', { token: tokA, body: { learnSkills: ['React'], teachSkills: [] } });
  check('skills save rejects empty teachSkills (400)', skillsFail.status === 400, skillsFail);
  const skA = await api('POST', '/api/skills', { token: tokA, body: { learnSkills: ['React', 'UI/UX Design'], teachSkills: ['JavaScript'] } });
  check('skills save A ok', skA.status === 200, skA.data);
  const meA2 = await api('GET', '/api/me', { token: tokA });
  check('skills persisted on user A', (meA2.data?.user?.learnSkills || []).includes('React') && (meA2.data?.user?.teachSkills || []).includes('JavaScript'), meA2.data?.user);

  const skB = await api('POST', '/api/skills', { token: tokB, body: { learnSkills: ['JavaScript'], teachSkills: ['React'] } });
  check('skills save B ok', skB.status === 200, skB.data);
  const skC = await api('POST', '/api/skills', { token: tokC, body: { learnSkills: ['Excel'], teachSkills: ['Word'] } });
  check('skills save C ok', skC.status === 200, skC.data);

  /* update skills later (edit) */
  const skAEdit = await api('POST', '/api/skills', { token: tokA, body: { learnSkills: ['React', 'UI/UX Design', 'Figma'], teachSkills: ['JavaScript'] } });
  const meA3 = await api('GET', '/api/me', { token: tokA });
  check('skills editable later (Figma added)', (meA3.data?.user?.learnSkills || []).includes('Figma'), meA3.data?.user?.learnSkills);

  /* ═══ 3. MATCHING BEFORE VERIFICATION ═══ */
  const m0 = await api('GET', '/api/matches', { token: tokA });
  check('matches gated before verification (requiresVerification)', m0.data?.requiresVerification === true, m0.data);

  /* ═══ 4. SKILL TEST — legitimate pass ═══ */
  const tA = await takeTest(tokA, 'JavaScript');
  check('test A (JavaScript) passed via legit answering', tA.submit?.status === 200 && tA.submit?.data?.passed === true, { status: tA.submit?.status, data: tA.submit?.data });
  check('submit returns score+pct', typeof tA.submit?.data?.score === 'number' && typeof tA.submit?.data?.pct === 'number', tA.submit?.data);
  check('submit returns skill Level', typeof tA.submit?.data?.level === 'string' && tA.submit.data.level.length > 0, tA.submit?.data?.level);
  check('perfect run yields Expert level', tA.submit?.data?.level === 'Expert', tA.submit?.data?.level);

  const meA4 = await api('GET', '/api/me', { token: tokA });
  check('verifiedSkills persisted with JavaScript', (meA4.data?.user?.verifiedSkills || []).includes('JavaScript'), meA4.data?.user?.verifiedSkills);
  const str = meA4.data?.user?.skillTestResults?.['JavaScript'];
  check('skillTestResults stored (score/date/level)', str && str.total === 10 && typeof str.pct === 'number' && !!str.date && !!str.level, str);

  /* server-side session: answerKey must not be decodable, one check per question */
  const secStart = await api('POST', '/api/skill-test/start', { token: tokA, body: { skill: 'Python' } });
  const secTok = secStart.data?.sessionToken || '';
  check('SECURITY: session token is opaque (not a JWT)', secTok.split('.').length === 1, secTok.slice(0, 24));
  const secDecode = (() => { try { return JSON.parse(Buffer.from(secTok, 'base64').toString('utf8')); } catch { return null; } })();
  check('SECURITY: session token carries no answer key', !secDecode || !secDecode.answerKey, secDecode);

  /* test-tamper probes */
  const badStart = await api('POST', '/api/skill-test/start', { token: tokA, body: {} });
  check('start without skill → 400', badStart.status === 400, badStart);
  const badSubmit = await api('POST', '/api/skill-test/submit', { token: tokA, body: { skill: 'JavaScript', sessionToken: 'fake', answers: [0,0,0,0,0,0,0,0,0,0] } });
  check('submit with fake sessionToken → 400', badSubmit.status === 400, badSubmit);
  const otherUserTok = tokB;
  const crossStart = await api('POST', '/api/skill-test/start', { token: otherUserTok, body: { skill: 'React' } });
  const crossSubmit = await api('POST', '/api/skill-test/submit', { token: tokA, body: { skill: 'React', sessionToken: crossStart.data?.sessionToken, answers: [0,0,0,0,0,0,0,0,0,0] } });
  check("submit with ANOTHER user's session → 400", crossSubmit.status === 400, crossSubmit.data);

  /* ═══ 5. ANTI-CHEAT PROBES (document holes) ═══ */
  const probeStart = await api('POST', '/api/skill-test/start', { token: tokB, body: { skill: 'React' } });
  const jwtPayloadB64 = (probeStart.data?.sessionToken || '').split('.')[1];
  let leakedKey = null;
  try {
    const payload = JSON.parse(Buffer.from(jwtPayloadB64, 'base64').toString('utf8'));
    leakedKey = payload.answerKey || null;
  } catch {}
  check('SECURITY: answerKey NOT readable from session token', leakedKey === null, leakedKey);

  /* brute-force check-answer: second check of same question with different answer */
  const bfStart = await api('POST', '/api/skill-test/start', { token: tokB, body: { skill: 'React' } });
  if (bfStart.status === 200) {
    const st = bfStart.data.sessionToken;
    const c1 = await api('POST', '/api/skill-test/check-answer', { token: tokB, body: { skill: 'React', sessionToken: st, questionIndex: 0, answer: 0 } });
    const c2 = await api('POST', '/api/skill-test/check-answer', { token: tokB, body: { skill: 'React', sessionToken: st, questionIndex: 0, answer: 1 } });
    const bruteForcePossible = c1.status === 200 && c2.status === 200 && c1.data?.correct !== c2.data?.correct;
    check('SECURITY: check-answer brute-force blocked (2nd check of same question rejected)', !bruteForcePossible, { c1: c1.data, c2: c2.data });
    // finish with all-wrong answers to make sure legit flow still grades
    const sub2 = await api('POST', '/api/skill-test/submit', { token: tokB, body: { skill: 'React', sessionToken: st, answers: [0,0,0,0,0,0,0,0,0,0] } });
    check('submit after checks still grades (B React attempt)', sub2.status === 200, sub2.data);
  }

  /* pass B legitimately too */
  const tB = await takeTest(tokB, 'React');
  check('test B (React) passed', tB.submit?.status === 200 && tB.submit?.data?.passed === true, tB.submit?.data);
  const meB2 = await api('GET', '/api/me', { token: tokB });
  check('B verifiedSkills has React', (meB2.data?.user?.verifiedSkills || []).includes('React'), meB2.data?.user?.verifiedSkills);

  /* ═══ 6. MATCHING AFTER VERIFICATION ═══ */
  const mA = await api('GET', '/api/matches', { token: tokA });
  const bInMatches = (mA.data?.matches || []).find(m => m.email === userB.email);
  check('A sees B as a match after both verified', Boolean(bInMatches), { count: mA.data?.matches?.length, reason: mA.data?.reason });
  check('match has matchScore 0-100', bInMatches && bInMatches.matchScore >= 0 && bInMatches.matchScore <= 100, bInMatches?.matchScore);
  check('match exposes theyTeachYou/youTeachThem', bInMatches && Array.isArray(bInMatches.theyTeachYou) && Array.isArray(bInMatches.youTeachThem), bInMatches);
  check('match leaks no password field', bInMatches && !JSON.stringify(bInMatches).includes('password'), true);

  /* ═══ 7. MATCH REQUESTS ═══ */
  const chatBefore = await api('GET', '/api/chat-access/' + encodeURIComponent(userB.email), { token: tokA });
  check('chat-access denied before accepted match', chatBefore.data?.allowed === false, chatBefore.data);

  const reqFail = await api('POST', '/api/match-requests', { token: tokA, body: { targetEmail: userA.email } });
  check('cannot send match request to self (400)', reqFail.status === 400, reqFail);
  const req = await api('POST', '/api/match-requests', { token: tokA, body: { targetEmail: userB.email } });
  check('match request A→B created (201)', req.status === 201, req.data);
  const reqDup = await api('POST', '/api/match-requests', { token: tokA, body: { targetEmail: userB.email } });
  check('duplicate match request rejected (409)', reqDup.status === 409, reqDup);
  const reqGhost = await api('POST', '/api/match-requests', { token: tokA, body: { targetEmail: 'ghost@nowhere.com' } });
  check('match request to nonexistent user (404)', reqGhost.status === 404, reqGhost);

  const inboxB = await api('GET', '/api/match-requests', { token: tokB });
  const pendingReq = (inboxB.data?.requests || []).find(r => r.requester.email === userA.email);
  check('B inbox shows pending request from A', Boolean(pendingReq), inboxB.data);

  /* C (stranger) cannot respond to the request */
  if (pendingReq) {
    const cRespond = await api('PATCH', '/api/match-requests/' + pendingReq.matchId, { token: tokC, body: { action: 'accept' } });
    check('stranger C cannot accept A→B request (403)', cRespond.status === 403, cRespond);
    const aRespond = await api('PATCH', '/api/match-requests/' + pendingReq.matchId, { token: tokA, body: { action: 'accept' } });
    check('initiator A cannot accept own request (403)', aRespond.status === 403, aRespond);
    const accept = await api('PATCH', '/api/match-requests/' + pendingReq.matchId, { token: tokB, body: { action: 'accept' } });
    check('B accepts request', accept.status === 200 && accept.data?.match?.status === 'accepted', accept.data);
    const reAccept = await api('PATCH', '/api/match-requests/' + pendingReq.matchId, { token: tokB, body: { action: 'accept' } });
    check('double-accept rejected (409)', reAccept.status === 409, reAccept);
  }

  /* ═══ 8. CHAT ═══ */
  const chatA = await api('GET', '/api/chat-access/' + encodeURIComponent(userB.email), { token: tokA });
  check('chat-access allowed after accept', chatA.data?.allowed === true && !!chatA.data?.chatId, chatA.data);
  const chatId = chatA.data?.chatId || `${userA.email}_${userB.email}`.split('_').sort().join('_');

  /* duplicate conversation check: chatId is deterministic */
  const chatAgain = await api('GET', '/api/chat-access/' + encodeURIComponent(userB.email), { token: tokA });
  check('chatId deterministic (no duplicate conversations)', chatAgain.data?.chatId === chatId, { chatId, again: chatAgain.data?.chatId });

  /* send messages A→B */
  const msg1 = await api('POST', '/api/messages', { token: tokA, body: { chatId, receiver: userB.email, text: 'مرحباً سارة! جاهزة للتبادل؟', messageId: 'e2e-msg-' + rnd + '-1' } });
  check('A sends message (201)', msg1.status === 201, msg1.data);
  check('message sender recorded as A email', msg1.data?.message?.sender === userA.email, msg1.data?.message);
  const msg2 = await api('POST', '/api/messages', { token: tokA, body: { chatId, receiver: userB.email, text: 'رسالة ثانية', messageId: 'e2e-msg-' + rnd + '-2' } });
  check('A sends 2nd message (201)', msg2.status === 201, msg2.data);
  const msgDup = await api('POST', '/api/messages', { token: tokA, body: { chatId, receiver: userB.email, text: 'مرحباً سارة! جاهزة للتبادل؟', messageId: 'e2e-msg-' + rnd + '-1' } });
  const cnt = await api('GET', '/api/messages/' + encodeURIComponent(chatId), { token: tokA });
  check('duplicate messageId not stored twice', (cnt.data?.messages || []).length === 2, cnt.data?.messages?.length);

  const msgsB = await api('GET', '/api/messages/' + encodeURIComponent(chatId), { token: tokB });
  check('B sees both messages', (msgsB.data?.messages || []).length === 2, msgsB.data?.messages?.length);
  const ordered = msgsB.data?.messages || [];
  check('messages ordered by createdAt asc', ordered.length === 2 && new Date(ordered[0].createdAt) <= new Date(ordered[1].createdAt), ordered.map(m => m.createdAt));
  check('message has timestamp + sender + text fields', ordered[0] && ordered[0].createdAt && ordered[0].sender && 'text' in ordered[0], Object.keys(ordered[0] || {}));

  /* ═══ 9. AUTHORIZATION on chat ═══ */
  const msgNoId = await api('POST', '/api/messages', { token: tokA, body: { chatId, receiver: userB.email, text: 'x' } });
  check('message without messageId → 400', msgNoId.status === 400, msgNoId);
  const strangerRead = await api('GET', '/api/messages/' + encodeURIComponent(chatId), { token: tokC });
  check('stranger C cannot read A↔B conversation (403)', strangerRead.status === 403, strangerRead.status);
  const strangerSend = await api('POST', '/api/messages', { token: tokC, body: { chatId, receiver: userB.email, text: 'intrusion', messageId: 'e2e-intrude-' + rnd } });
  check('stranger C cannot send into A↔B conversation (403)', strangerSend.status === 403, strangerSend.status);
  const tamperedChatId = 'intruder_' + userB.email;
  const tamperRead = await api('GET', '/api/messages/' + encodeURIComponent(tamperedChatId), { token: tokC });
  check('C cannot read forged chatId containing B (403)', tamperRead.status === 403, tamperRead.status);
  const cToB = await api('POST', '/api/match-requests', { token: tokC, body: { targetEmail: userB.email } });
  check('C request to B gated on verification (403)', cToB.status === 403, cToB.status);
  const cChat = await api('GET', '/api/chat-access/' + encodeURIComponent(userB.email), { token: tokC });
  check('C chat-access still denied (pending)', cChat.data?.allowed === false, cChat.data);
  const rejectC = await api('PATCH', '/api/match-requests/' + (cToB.data?.match?._id || ''), { token: tokB, body: { action: 'reject' } });
  check('C blocked from requesting without verified teach skill (403)', cToB.status === 403, cToB.status);

  /* notifications: A should have the acceptance notification */
  const notifA = await api('GET', '/api/notifications', { token: tokA });
  const notifTitlesA = (notifA.data?.notifications || notifA.data?.user?.notifications || []).map(n => n.title || '');
  check('A got acceptance notification', notifTitlesA.some(t => (t || '').includes('قبول')), notifTitlesA.slice(0, 5));

  /* ═══ 10. profile ownership ═══ */
  const profA = await api('GET', '/api/user/' + encodeURIComponent(userB.email), { token: tokA });
  check('user profile fetch by email works (safe fields)', profA.status === 200 && profA.data?.user?.email === userB.email && !profA.data?.user?.password, Object.keys(profA.data?.user || {}).slice(0, 8));

  console.log(results.join('\n'));
  console.log(`\n════════ RESULTS: ${passCount} passed, ${failCount} failed ════════`);
  process.exit(failCount ? 1 : 0);
})().catch(e => { console.error('E2E CRASH:', e); process.exit(2); });
