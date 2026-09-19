const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new', protocolTimeout: 90000 });
  const p = await b.newPage();
  p.on('dialog', d => { console.log('DIALOG:', d.message()); d.dismiss(); });
  p.on('pageerror', e => console.log('PAGEERR:', e.message.slice(0, 100)));
  await p.setRequestInterception(true);
  p.on('request', r => { const u = r.url(); if ((u.startsWith('http://') || u.startsWith('https://')) && !u.startsWith('http://localhost:3000')) r.abort(); else r.continue(); });
  const BASE = 'http://localhost:3000'; const rnd = Date.now();
  async function api(m, path, { token, body } = {}) { const r = await fetch(BASE + path, { method: m, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined }); let d = null; try { d = await r.json() } catch { }; return { status: r.status, data: d } }
  async function passTest(token, skill) { const st = await api('POST', '/api/skill-test/start', { token, body: { skill } }); const ans = []; for (let qi = 0; qi < st.data.questions.length; qi++) { let f = 0; for (let o = 0; o < st.data.questions[qi].opts.length; o++) { const c = await api('POST', '/api/skill-test/check-answer', { token, body: { skill, sessionToken: st.data.sessionToken, questionIndex: qi, answer: o } }); if (c.status !== 200) break; if (c.data.correct) { f = o; break } } ans.push(f) } return (await api('POST', '/api/skill-test/submit', { token, body: { skill, sessionToken: st.data.sessionToken, answers: ans } })).data?.passed }
  const A = { email: 'chat.a.' + rnd + '@t.com' }, B = { email: 'chat.b.' + rnd + '@t.com' };
  const ra = await api('POST', '/api/register', { body: { username1: 'a', username2: 'a', email: A.email, password: 'Test1234!' } });
  const rb = await api('POST', '/api/register', { body: { username1: 'b', username2: 'b', email: B.email, password: 'Test1234!' } });
  await api('POST', '/api/skills', { token: ra.data.token, body: { learnSkills: ['React'], teachSkills: ['JavaScript'] } });
  await api('POST', '/api/skills', { token: rb.data.token, body: { learnSkills: ['JavaScript'], teachSkills: ['React'] } });
  await passTest(ra.data.token, 'JavaScript'); await passTest(rb.data.token, 'React');
  await api('POST', '/api/match-requests', { token: ra.data.token, body: { targetEmail: B.email } });
  const ib = await api('GET', '/api/match-requests', { token: rb.data.token });
  const req = ib.data.requests.find(x => x.requester.email === A.email);
  await api('PATCH', '/api/match-requests/' + req.matchId, { token: rb.data.token, body: { action: 'accept' } });
  const tok = ra.data.token, usr = ra.data.user;
  await p.evaluateOnNewDocument((tok, usr) => { localStorage.setItem('token', tok); localStorage.setItem('currentUser', JSON.stringify(usr)); }, tok, usr);
  await p.goto(BASE + '/login-signup/chat.html?user=' + encodeURIComponent(B.email), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3500));
  await p.type('#messageInput', 'مرحباً اختبار الإرسال');
  await p.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1200));
  const st1 = await p.evaluate(() => ({ count: document.querySelectorAll('#chatMessages .message').length, html: document.getElementById('chatMessages').innerHTML.slice(0, 260), inputVal: document.getElementById('messageInput').value }));
  console.log('after Enter:', JSON.stringify(st1).slice(0, 420));
  await new Promise(r => setTimeout(r, 2500));
  const st2 = await p.evaluate(() => ({ count: document.querySelectorAll('#chatMessages .message').length, html: document.getElementById('chatMessages').innerHTML.slice(0, 260) }));
  console.log('after +2.5s:', JSON.stringify(st2).slice(0, 420));
  await b.close();
})();
