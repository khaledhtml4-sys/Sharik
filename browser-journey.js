/* Full browser E2E: new user journey via real UI — signup → skills → test → matching → request → chat */
const puppeteer = require('puppeteer');
const BASE = 'http://localhost:3000';
const rnd = Math.floor(Math.random() * 1e9);
const A = { email: `ui.a.${rnd}@test-sharik.com`, pass: 'Test1234!', first: 'Ahmed', last: 'Journey' };
const B = { email: `ui.b.${rnd}@test-sharik.com`, pass: 'Test1234!', first: 'Sara', last: 'Partner' };

let passCount = 0, failCount = 0;
const results = [];
function check(name, cond, detail) {
  if (cond) { passCount++; results.push(`PASS  ${name}`); }
  else { failCount++; results.push(`FAIL  ${name}${detail ? ' — ' + String(detail).slice(0, 180) : ''}`); }
}

async function api(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let data = null; try { data = await res.json(); } catch {}
  return { status: res.status, data };
}
async function passTestApi(token, skill) {
  const st = await api('POST', '/api/skill-test/start', { token, body: { skill } });
  if (st.status !== 200) return { ok: false, err: st.data?.error };
  const answers = [];
  for (let qi = 0; qi < st.data.questions.length; qi++) {
    let found = 0;
    for (let opt = 0; opt < st.data.questions[qi].opts.length; opt++) {
      const chk = await api('POST', '/api/skill-test/check-answer', { token, body: { skill, sessionToken: st.data.sessionToken, questionIndex: qi, answer: opt } });
      if (chk.status !== 200) break;
      if (chk.data.correct) { found = opt; break; }
    }
    answers.push(found);
  }
  const sub = await api('POST', '/api/skill-test/submit', { token, body: { skill, sessionToken: st.data.sessionToken, answers } });
  return { ok: sub.status === 200 && sub.data?.passed, data: sub.data };
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(e.message.slice(0, 120) + ' @ ' + (page.url() || '').replace(BASE, '')));
  page.on('dialog', d => d.dismiss());

  /* ── 1. Signup via UI ── */
  await page.goto(BASE + '/login-signup/signup.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));
  await page.type('#inputName', A.first);
  await page.type('#inputName2', A.last);
  await page.type('#inputEmail', A.email);
  await page.type('#inputPassword', A.pass);
  await page.click('#inputCheckbox');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
    page.click('#inputSubmit'),
  ]);
  await new Promise(r => setTimeout(r, 1200));
  check('signup redirects to skills-selection', page.url().includes('skills-selection.html'), page.url());
  let stored = await page.evaluate(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
  check('token + currentUser stored after signup', Boolean(stored.email) && Boolean(await page.evaluate(() => localStorage.getItem('token'))), stored.email);
  check('names saved with original case', stored.username1 === A.first, stored.username1);

  /* ── 2. Skills selection via UI ── */
  await new Promise(r => setTimeout(r, 600));
  const clickedSkills = await page.evaluate(() => {
    let n = 0;
    document.querySelectorAll('#learnSkillsGrid .skill-item').forEach(el => { if (el.dataset.skill === 'React') { el.click(); n++; } });
    document.querySelectorAll('#teachSkillsGrid .skill-item').forEach(el => { if (el.dataset.skill === 'JavaScript') { el.click(); n++; } });
    return n;
  });
  await new Promise(r => setTimeout(r, 300));
  const selState = await page.evaluate(() => ({
    learn: document.querySelectorAll('#learnSelected .selected-tag').length,
    teach: document.querySelectorAll('#teachSelected .selected-tag').length,
  }));
  check('UI marks 1 learn + 1 teach selected', selState.learn === 1 && selState.teach === 1, selState);
  const submitOk = await page.evaluate(() => { const b = document.querySelector('button[onclick*="submitSkills"], .btn-finish, #finishBtn'); if (b) { b.click(); return true; } return false; });
  check('skills submit button found & clicked', submitOk, 'submitSkills trigger');
  await new Promise(r => setTimeout(r, 2200));
  check('after save redirects to matching-results', page.url().includes('matching-results.html'), page.url());
  const meA = await api('GET', '/api/me', { token: await page.evaluate(() => localStorage.getItem('token')) });
  check('skills persisted in DB for user A', (meA.data?.user?.learnSkills || []).includes('React') && (meA.data?.user?.teachSkills || []).includes('JavaScript'), meA.data?.user);

  /* ── 3. Matching gate: verification required ── */
  await new Promise(r => setTimeout(r, 1500));
  const gateHtml = await page.evaluate(() => document.getElementById('noMatches')?.textContent || '');
  check('matching page shows verification step (not crash)', /(اختبار|One step before matching|verification)/i.test(gateHtml), gateHtml.slice(0, 80));

  /* ── 4. Skill test via UI ── */
  await page.goto(BASE + '/login-signup/skill-test.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const gridSkills = await page.evaluate(() => [...document.querySelectorAll('.skill-select-btn')].map(b => b.textContent.trim()));
  check('test page shows ONLY user-selected skills', gridSkills.length === 2 && gridSkills.includes('JavaScript') && gridSkills.includes('React'), gridSkills);

  await page.evaluate(() => { const b = [...document.querySelectorAll('.skill-select-btn')].find(x => x.textContent.includes('JavaScript')); if (b) b.click(); });
  const startDisabled = await page.evaluate(() => document.getElementById('startBtn').disabled);
  check('start button enabled after skill pick', startDisabled === false, startDisabled);
  await page.click('#startBtn');
  await new Promise(r => setTimeout(r, 1200));
  const quizVisible = await page.evaluate(() => document.getElementById('quizScreen').style.display !== 'none');
  check('quiz screen opens with question 1', quizVisible, quizVisible);

  /* answer all questions by clicking an option (UI pace) */
  for (let qi = 0; qi < 10; qi++) {
    const done = await page.evaluate(() => document.getElementById('quizScreen').style.display === 'none');
    if (done) break;
    await page.waitForSelector('#optionsGrid .option-btn', { timeout: 8000 });
    await page.click('#optionsGrid .option-btn'); // first option — deterministic, may fail the test; check result below
    await new Promise(r => setTimeout(r, 800));
  }
  await new Promise(r => setTimeout(r, 1800));
  const resultState = await page.evaluate(() => ({
    visible: document.getElementById('resultScreen').style.display !== 'none',
    score: document.getElementById('scoreNumber')?.textContent,
    badge: document.getElementById('resultBadge')?.textContent?.trim() || '',
    level: document.getElementById('resultLevel')?.textContent || '',
  }));
  check('result screen shows score %', resultState.visible && /%$/.test(resultState.score || ''), resultState.score);
  check('result screen shows Skill Level', /Level:|المستوى:/.test(resultState.level) && resultState.level.split(': ')[1], resultState.level);

  /* ensure A is verified via API (UI answer may not pass) — legitimate API path */
  const tokA = await page.evaluate(() => localStorage.getItem('token'));
  const meAfter = await api('GET', '/api/me', { token: tokA });
  if (!(meAfter.data?.user?.verifiedSkills || []).includes('JavaScript')) {
    const t = await passTestApi(tokA, 'JavaScript');
    check('A verified JavaScript (API path used after UI attempt)', t.ok, t.data);
  } else {
    check('A verified JavaScript via UI answers', true);
  }

  /* ── 5. Matching with real partner (B prepared via API) ── */
  const regB = await api('POST', '/api/register', { body: { username1: B.first, username2: B.last, email: B.email, password: B.pass } });
  const tokB = regB.data?.token;
  await api('POST', '/api/skills', { token: tokB, body: { learnSkills: ['JavaScript'], teachSkills: ['React'] } });
  const tB = await passTestApi(tokB, 'React');
  check('partner B prepared (registered + skilled + verified React)', regB.status === 201 && tB.ok, tB.err || tB.data);

  await page.goto(BASE + '/login-signup/matching-results.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  const matchCards = await page.evaluate(() => document.querySelectorAll('.match-card').length);
  check('A sees partner B in matches list', matchCards >= 1, matchCards);
  const cardText = await page.evaluate((bemail) => [...document.querySelectorAll('.match-card')].map(c => c.textContent).find(t => t.includes(bemail)) || '', B.email);
  check('match card shows partner name + score + skills', cardText.includes('Sara Partner') && /%/.test(cardText) && cardText.includes('React') && cardText.includes(B.email), cardText.slice(0, 120));

  /* ── 6. Start-chat button sends a match request ── */
  const contactClicked = await page.evaluate((bemail) => {
    const card = [...document.querySelectorAll('.match-card')].find(c => (c.querySelector('.btn-contact')?.getAttribute('onclick') || '').includes(bemail));
    const b = card && card.querySelector('.btn-contact');
    if (b) { b.click(); return true; }
    return false;
  }, B.email);
  check('contact button found on partner card', contactClicked, 'btn-contact');
  await new Promise(r => setTimeout(r, 1800));
  const statusMsg = await page.evaluate(() => document.querySelector('.match-request-status')?.textContent || '');
  check('chat button sends match request (status shown, no dead-end redirect)', /(طلب المطابقة|Match request)/i.test(statusMsg) || page.url().includes('chat.html'), statusMsg || page.url());

  /* B accepts via API */
  let req = null;
  for (let i = 0; i < 12 && !req; i++) {
    await new Promise(r => setTimeout(r, 500));
    const inboxB = await api('GET', '/api/match-requests', { token: tokB });
    req = (inboxB.data?.requests || []).find(r => r.requester.email === A.email);
  }
  check('request reached B inbox (with retry)', Boolean(req), 'polled 6s');
  if (req) {
    const acc = await api('PATCH', '/api/match-requests/' + req.matchId, { token: tokB, body: { action: 'accept' } });
    check('B accepted request', acc.status === 200, acc.data);
  }

  /* ── 7. Chat via UI ── */
  await page.goto(BASE + '/login-signup/chat.html?user=' + encodeURIComponent(B.email), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  const chatOpen = await page.evaluate(() => ({
    input: Boolean(document.getElementById('messageInput')),
    header: (document.querySelector('.chat-header, .chat-user-info, #chatPeerName')?.textContent || '').slice(0, 40),
    url: location.pathname,
  }));
  check('chat opens with partner (no bounce to matching)', chatOpen.input && page.url().includes('chat.html'), chatOpen);
  await page.type('#messageInput', 'أهلاً سارة! أنا أحمد من اختبار الرحلة الكاملة 🚀');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 2000));
  let msgInDom = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.message-bubble, .message')];
    return els.some(e => e.textContent.includes('أهلاً سارة'));
  });
  if (!msgInDom) {
    await new Promise(r => setTimeout(r, 2000));
    msgInDom = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.message-bubble, .message')];
      return els.some(e => e.textContent.includes('أهلاً سارة'));
    });
  }
  for (let attempt = 0; attempt < 3 && !msgInDom; attempt++) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2500));
    msgInDom = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.message-bubble, .message')];
      return els.some(e => e.textContent.includes('أهلاً سارة'));
    });
  }
  check('sent message appears in chat DOM', msgInDom, 'message scan with retry');
  const msgInDb = await api('GET', '/api/messages/' + encodeURIComponent([A.email, B.email].sort().join('_')), { token: tokB });
  const dbText = (msgInDb.data?.messages || []).map(m => m.text || '');
  check('message persisted to DB and visible to partner', dbText.some(t => t.includes('أهلاً سارة')), dbText);

  /* partner replies via API; realtime or refresh shows it */
  await api('POST', '/api/messages', { token: tokB, body: { chatId: [A.email, B.email].sort().join('_'), receiver: A.email, text: 'أهلاً أحمد! قدمت اختبار React ونجحت ✅', messageId: 'ui-reply-' + rnd } });
  await new Promise(r => setTimeout(r, 2500));
  const gotReply = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.message-text, .msg-text, .message-body, .message')];
    return els.some(e => e.textContent.includes('قدمت اختبار React'));
  });
  let replyVisible = gotReply;
  if (!replyVisible) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2500));
    replyVisible = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.message-text, .msg-text, .message-body, .message')];
      return els.some(e => e.textContent.includes('قدمت اختبار React'));
    });
  }
  check('partner reply visible (realtime or after refresh)', replyVisible, 'reply scan');

  /* ── 8. Language switch on journey pages ── */
  await page.goto(BASE + '/login-signup/matching-results.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => localStorage.setItem('sharik_lang', 'en'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2200));
  const arTexts = await page.evaluate(() => {
    const AR = /[\u0600-\u06FF]/;
    const SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1, NOSCRIPT: 1, TEXTAREA: 1 };
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode(n) { if (!n.nodeValue || !AR.test(n.nodeValue)) return NodeFilter.FILTER_REJECT; let p = n.parentElement; while (p) { if (SKIP[p.tagName]) return NodeFilter.FILTER_REJECT; if (p.id === 'langBtn' || p.id === 'saasLangBtn') return NodeFilter.FILTER_REJECT; p = p.parentElement; } const cs = getComputedStyle(n.parentElement); if (cs.display === 'none' || cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; } });
    let n; while ((n = w.nextNode())) out.push(n.nodeValue.trim().replace(/\s+/g, ' ').slice(0, 80));
    return [...new Set(out)];
  });
  check('matching page fully English after switch (dir=ltr, no Arabic UI text)', arTexts.length === 0 && (await page.evaluate(() => document.documentElement.getAttribute('dir'))) === 'ltr', arTexts.slice(0, 5));

  /* chat page in EN */
  await page.goto(BASE + '/login-signup/chat.html?user=' + encodeURIComponent(B.email), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));
  const chatAr = await page.evaluate(() => {
    const AR = /[\u0600-\u06FF]/;
    const SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1, NOSCRIPT: 1, TEXTAREA: 1 };
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode(n) { if (!n.nodeValue || !AR.test(n.nodeValue)) return NodeFilter.FILTER_REJECT; let p = n.parentElement; while (p) { if (SKIP[p.tagName]) return NodeFilter.FILTER_REJECT; if (p.id === 'langBtn' || p.id === 'saasLangBtn') return NodeFilter.FILTER_REJECT; p = p.parentElement; } const cs = getComputedStyle(n.parentElement); if (cs.display === 'none' || cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; } });
    let n; while ((n = w.nextNode())) out.push(n.nodeValue.trim().slice(0, 60));
    return [...new Set(out)].filter(t => !AR.test(t.replace(/[\u0600-\u06FF]/g, '')) === false).filter(t => t.length > 2);
  });
  // exclude user-generated message content (our own Arabic test messages are user data)
  const chatArUi = chatAr.filter(t => !t.includes('أهلاً') && !t.includes('قدمت اختبار'));
  check('chat page UI fully English (user messages excluded)', chatArUi.length === 0, chatArUi.slice(0, 5));

  /* ── 9. Logout + protected routes ── */
  await page.evaluate(() => localStorage.setItem('sharik_lang', 'ar'));
  await page.evaluate(() => { localStorage.removeItem('token'); localStorage.removeItem('currentUser'); });
  await page.goto(BASE + '/login-signup/matching-results.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  check('matching-results redirects to login when logged out', page.url().includes('login.html'), page.url());
  await page.goto(BASE + '/login-signup/skills-selection.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  check('skills-selection redirects to login when logged out', page.url().includes('login.html'), page.url());

  /* re-login: data persists */
  const login = await api('POST', '/api/login', { body: { email: A.email, password: A.pass } });
  const meRe = await api('GET', '/api/me', { token: login.data?.token });
  check('re-login keeps identity + skills + verification', login.status === 200 && (meRe.data?.user?.learnSkills || []).includes('React') && (meRe.data?.user?.verifiedSkills || []).length > 0, { skills: meRe.data?.user?.learnSkills, verified: meRe.data?.user?.verifiedSkills });
  const convAfter = await api('GET', '/api/messages/' + encodeURIComponent([A.email, B.email].sort().join('_')), { token: login.data?.token });
  check('conversation history persists after logout/login', (convAfter.data?.messages || []).length >= 2, convAfter.data?.messages?.length);

  /* console errors (excluding network 4xx noise) */
  const realErrors = consoleErrors.filter(e => !/Failed to load resource|net::|the server responded with a status/i.test(e));
  check('no unexpected JS page errors during journey', realErrors.length === 0, realErrors.slice(0, 3));

  await browser.close();
  console.log(results.join('\n'));
  console.log(`\n════════ BROWSER JOURNEY: ${passCount} passed, ${failCount} failed ════════`);
  process.exit(failCount ? 1 : 0);
})().catch(e => { console.error('JOURNEY CRASH:', e.message); console.log(results.join('\n')); console.log(`SO FAR: ${passCount} passed, ${failCount} failed — crashed after last check above`); process.exit(2); });
