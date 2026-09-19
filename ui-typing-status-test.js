// اختبار متصفح بصفحتين: مؤشر الكتابة + الرسائل الفورية + حالة الاتصال
const puppeteer = require('puppeteer');
const path = require('path');
const { io } = require(path.join(__dirname, 'node-js كامل', 'node_modules', 'socket.io-client'));
const BASE = 'http://localhost:3000';
const rnd = Date.now();

async function api(m, p, { token, body } = {}) {
  const r = await fetch(BASE + p, { method: m, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let d = null; try { d = await r.json(); } catch {}
  return { status: r.status, data: d };
}
async function passTest(token, skill) {
  const st = await api('POST', '/api/skill-test/start', { token, body: { skill } });
  const bank = require('./node-js كامل/modules/skillQuestionBank.js');
  const bankList = bank.questionBank[skill] || [];
  const byQ = new Map(bankList.map(b => [b.q, b]));
  const ans = st.data.questions.map(q => {
    const b = byQ.get(q.q) || (q.en ? byQ.get(q.en.q) : null);
    if (!b) return 0;
    const idx = (q.opts || []).indexOf(b.opts[b.ans]);
    return idx >= 0 ? idx : b.ans;
  });
  return (await api('POST', '/api/skill-test/submit', { token, body: { skill, sessionToken: st.data.sessionToken, answers: ans } })).data?.passed;
}

(async () => {
  const A = { email: `ui.a.${rnd}@t.com` }, B = { email: `ui.b.${rnd}@t.com` };
  const ra = await api('POST', '/api/register', { body: { username1: 'aa', username2: 'aa', email: A.email, password: 'Test1234!' } });
  const rb = await api('POST', '/api/register', { body: { username1: 'bb', username2: 'bb', email: B.email, password: 'Test1234!' } });
  await api('POST', '/api/skills', { token: ra.data.token, body: { learnSkills: ['React'], teachSkills: ['JavaScript'] } });
  await api('POST', '/api/skills', { token: rb.data.token, body: { learnSkills: ['JavaScript'], teachSkills: ['React'] } });
  await passTest(ra.data.token, 'JavaScript');
  await passTest(rb.data.token, 'React');
  await api('POST', '/api/match-requests', { token: ra.data.token, body: { targetEmail: B.email } });
  const ib = await api('GET', '/api/match-requests', { token: rb.data.token });
  const req = (ib.data.requests || []).find(x => x.requester.email === A.email);
  const acc = await api('PATCH', '/api/match-requests/' + req.matchId, { token: rb.data.token, body: { action: 'accept' } });
  const chatId = acc.data?.match?.chatId || acc.data?.chatId;
  console.log('setup ok, chatId=', chatId);

  const b = await puppeteer.launch({ headless: 'new', protocolTimeout: 90000, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  async function newPage() {
    const ctx = await b.createBrowserContext();
    const p = await ctx.newPage();
    p.on('dialog', d => { console.log('DIALOG:', d.message()); d.dismiss(); });
    p.on('pageerror', e => console.log('PAGEERR:', e.message.slice(0, 140)));
    p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0, 160)); });
    p.on('response', r => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url().slice(0, 120)); });
    return p;
  }
  const pa = await newPage(), pb = await newPage();
  await pa.evaluateOnNewDocument((tok, usr) => { localStorage.setItem('token', tok); localStorage.setItem('currentUser', JSON.stringify(usr)); }, ra.data.token, ra.data.user);
  await pb.evaluateOnNewDocument((tok, usr) => { localStorage.setItem('token', tok); localStorage.setItem('currentUser', JSON.stringify(usr)); }, rb.data.token, rb.data.user);
  const q = e => encodeURIComponent(e);
  await Promise.all([
    pa.goto(`${BASE}/login-signup/chat.html?user=${q(B.email)}`, { waitUntil: 'domcontentloaded' }),
    pb.goto(`${BASE}/login-signup/chat.html?user=${q(A.email)}`, { waitUntil: 'domcontentloaded' }),
  ]);
  await new Promise(r => setTimeout(r, 4000));

  const sockA = await pa.evaluate(() => !!(window.socket && window.socket.connected));
  const sockB = await pb.evaluate(() => !!(window.socket && window.socket.connected));
  console.log('sockets:', { A: sockA, B: sockB });

  // 1) A يكتب → B يجب أن يرى "يكتب الآن..."
  await pa.focus('#messageInput');
  await pa.type('#messageInput', 'مرحبا، أنا أكتب الآن');
  await new Promise(r => setTimeout(r, 1200));
  const bStatus1 = await pb.evaluate(() => document.getElementById('peerStatusTxt')?.textContent);
  const TYPING = ['يكتب الآن...', 'typing...', 'Typing...'];
  const ONLINE = ['متصل الآن', 'Online Now', 'Online now'];
  const OFFLINE = ['غير متصل الآن', 'Offline', 'Not connected'];
  console.log('B status while A typing:', bStatus1, TYPING.includes(bStatus1) ? 'PASS' : 'FAIL');

  // 2) بعد التوقف يجب أن يعود "متصل الآن"
  await new Promise(r => setTimeout(r, 3200));
  const bStatus2 = await pb.evaluate(() => document.getElementById('peerStatusTxt')?.textContent);
  console.log('B status after stop:', bStatus2, ONLINE.includes(bStatus2) ? 'PASS' : 'FAIL');

  // 3) A يرسل الرسالة → تصل فورياً لـ B وتظهر في الواجهة
  await pa.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1800));
  const bMsgs = await pb.evaluate(() => document.querySelectorAll('#chatMessages .message').length);
  const aMsgs = await pa.evaluate(() => document.querySelectorAll('#chatMessages .message').length);
  console.log('messages after Enter:', { A: aMsgs, B: bMsgs }, bMsgs > 0 ? 'PASS' : 'FAIL');

  // 4) B يكتب → A يرى "يكتب الآن..." (الاتجاه العكسي)
  await pb.focus('#messageInput');
  await pb.type('#messageInput', 'أهلاً، وجاهز');
  await new Promise(r => setTimeout(r, 1200));
  const aStatus = await pa.evaluate(() => document.getElementById('peerStatusTxt')?.textContent);
  console.log('A status while B typing:', aStatus, TYPING.includes(aStatus) ? 'PASS' : 'FAIL');

  // 5) قطع اتصال B من السيرفر → A يرى "غير متصل الآن"
  // نستخدم socket.io-client منفصل باسم B لقطع اتصال صفحة B عبر الخادم peerDisconnected
  await pb.evaluate(() => { window.socket && window.socket.disconnect(); });
  await new Promise(r => setTimeout(r, 1500));
  const aStatus2 = await pa.evaluate(() => document.getElementById('peerStatusTxt')?.textContent);
  console.log('A status after B disconnect:', aStatus2, OFFLINE.includes(aStatus2) ? 'PASS' : 'FAIL');

  await b.close();
  console.log('done');
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
