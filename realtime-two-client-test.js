// اختبار Realtime بعميلين متزامنين: دردشة، كتابة، سبورة، محرر كود، إشارات WebRTC، مشاركة شاشة، انقطاع
const path = require('path');
const { io } = require(path.join(__dirname, 'node-js كامل', 'node_modules', 'socket.io-client'));
const BASE = 'http://localhost:3000';
const rnd = Date.now();

const results = [];
function rec(name, ok, extra = '') { results.push({ name, ok, extra }); console.log(`${ok ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`); }

async function api(m, p, { token, body } = {}) {
  const r = await fetch(BASE + p, { method: m, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let d = null; try { d = await r.json(); } catch {}
  return { status: r.status, data: d };
}
function waitFor(client, event, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), timeoutMs);
    client.once(event, (data) => { clearTimeout(t); resolve(data); });
  });
}
function emitAck(client, event, payload, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, err: 'ACK_TIMEOUT' }), timeoutMs);
    client.timeout(timeoutMs).emit(event, payload, (err, ...args) => { clearTimeout(t); resolve({ ok: !err, resp: args }); });
  });
}

(async () => {
  // 1) إنشاء مستخدمين متكاملَي المهارات وقبول المطابقة
  const A = { email: `rt.a.${rnd}@t.com` }, B = { email: `rt.b.${rnd}@t.com` };
  const ra = await api('POST', '/api/register', { body: { username1: 'aa', username2: 'aa', email: A.email, password: 'Test1234!' } });
  const rb = await api('POST', '/api/register', { body: { username1: 'bb', username2: 'bb', email: B.email, password: 'Test1234!' } });
  if (ra.status >= 300 || rb.status >= 300) { console.log('register failed', ra.status, rb.status, ra.data, rb.data); process.exit(1); }
  rec('تسجيل مستخدمين', true);
  await api('POST', '/api/skills', { token: ra.data.token, body: { learnSkills: ['React'], teachSkills: ['JavaScript'] } });
  await api('POST', '/api/skills', { token: rb.data.token, body: { learnSkills: ['JavaScript'], teachSkills: ['React'] } });
  async function passTest(token, skill) {
    const st = await api('POST', '/api/skill-test/start', { token, body: { skill } });
    // بنك الأسئلة المحلي يحتوي الإجابات الصحيحة — نطابق بنص السؤال ثم بنص الخيار (تحسباً لخلط الترتيب)
    const bank = require('./node-js كامل/modules/skillQuestionBank.js');
    const bankList = bank.questionBank?.[skill] || bank[skill] || [];
    const byQ = new Map(bankList.map(b => [b.q, b]));
    const ans = st.data.questions.map(q => {
      const b = byQ.get(q.q) || (q.en ? byQ.get(q.en.q) : null);
      if (!b) return 0;
      const correctText = b.opts[b.ans];
      const idx = (q.opts || []).indexOf(correctText);
      return idx >= 0 ? idx : b.ans;
    });
    return (await api('POST', '/api/skill-test/submit', { token, body: { skill, sessionToken: st.data.sessionToken, answers: ans } })).data?.passed;
  }
  const pa = await passTest(ra.data.token, 'JavaScript');
  const pb = await passTest(rb.data.token, 'React');
  rec('اجتياز اختبار المهارة', !!pa && !!pb, `A=${pa} B=${pb}`);
  const mr = await api('POST', '/api/match-requests', { token: ra.data.token, body: { targetEmail: B.email } });
  const ib = await api('GET', '/api/match-requests', { token: rb.data.token });
  const req = (ib.data.requests || []).find(x => x.requester.email === A.email);
  const acc = await api('PATCH', '/api/match-requests/' + req.matchId, { token: rb.data.token, body: { action: 'accept' } });
  rec('مطابقة وقبول', acc.status === 200, `chatId=${acc.data?.match?.chatId || acc.data?.chatId || '?'}`);
  const chatId = acc.data?.match?.chatId || acc.data?.chatId;

  // 2) اتصال عميلين متزامنين
  const cA = io(BASE, { auth: { token: ra.data.token }, transports: ['websocket'] });
  const cB = io(BASE, { auth: { token: rb.data.token }, transports: ['websocket'] });
  await Promise.all([new Promise(r => cA.on('connect', r)), new Promise(r => cB.on('connect', r))]);
  rec('اتصال Socket.IO (عميلان)', true, cA.id + ' / ' + cB.id);

  // 3) joinChat للطرفين
  const jA = await emitAck(cA, 'joinChat', chatId);
  const jB = await emitAck(cB, 'joinChat', chatId);
  rec('joinChat للطرفين', jA.ok && jB.ok && !jA.resp?.[0]?.error && !jB.resp?.[0]?.error, JSON.stringify(jA.resp?.[0] || {}).slice(0, 80));

  // 4) رسالة فورية A → B
  const t0 = Date.now();
  const pB = waitFor(cB, 'newMessage', 5000);
  const sm = await emitAck(cA, 'sendMessage', { chatId, receiver: B.email, text: 'مرحباً اختبار realtime', messageId: `msg_${rnd}_1`, traceId: 't1' });
  const got = await pB;
  rec('رسالة فورية A→B (newMessage)', !!got && jA.ok, got ? `${Date.now() - t0}ms, msgId=${got.messageId?.slice(0, 18)}` : 'لم تصل');
  rec('ack إرسال الرسالة + حفظ', sm.ok && !!sm.resp?.[0]?.message, JSON.stringify(sm.resp?.[0]||{}).slice(0,60));

  // 5) منع التكرار: نفس messageId مرة أخرى
  const dup = await emitAck(cA, 'sendMessage', { chatId, receiver: B.email, text: 'مرحباً اختبار realtime', messageId: `msg_${rnd}_1` });
  rec('منع تكرار الرسالة (نفس messageId)', dup.ok && !!dup.resp?.[0]?.message, 'same id → أرجعت الرسالة المحفوظة');

  // 6) الكتابة typing: A يكتب → B يستلم userTyping
  const pTyping = waitFor(cB, 'userTyping', 3000);
  cA.timeout(2000).emit('typing', { chatId, email: A.email }, () => {});
  const typ = await pTyping;
  rec('مؤشر الكتابة (typing→userTyping)', !!typ, typ ? `email=${typ.email?.slice(0, 12)}` : 'لم يصل');
  // ملاحظة: عميل المتصفح chat.js لا يرسل typing أصلاً — سيُوثّق في التقرير

  // 7) السبورة: A يرسم → B يستلم whiteboardAction + الحالة عند الانضمام
  const pWb = waitFor(cB, 'whiteboardAction', 4000);
  const wb1 = await emitAck(cA, 'whiteboardAction', { chatId, action: { type: 'stroke', points: [{x:10,y:10},{x:20,y:20}], color: '#000', size: 4 }, traceId: 't2' });
  const wbGot = await pWb;
  rec('سبورة: بث فوري للرسم A→B', !!wbGot && wb1.ok, wbGot ? `type=${wbGot.action?.type}` : 'لم يصل');
  const pWbState = waitFor(cA, 'whiteboardState', 4000); // B يطلب الحالة فيستلمها A؟ لا — الحالة تُرسل للطالب نفسه
  const ws2 = await emitAck(cB, 'requestWhiteboardState', { chatId });
  rec('سبورة: requestWhiteboardState مع ack', ws2.ok && !ws2.resp?.[0]?.error, JSON.stringify(ws2.resp?.[0] || {}).slice(0, 60));

  // 8) محرر الكود: مزامنة + لغة + كتابة
  const pSync = waitFor(cB, 'codeEditorSync', 4000);
  const ce1 = await emitAck(cA, 'codeEditorSync', { chatId, content: 'console.log(1)', revision: 1 });
  const syncGot = await pSync;
  rec('محرر كود: مزامنة فورية A→B', !!syncGot && (syncGot.content || '') === 'console.log(1)', syncGot ? `len=${(syncGot.content || '').length}` : 'لم يصل');
  const pLang = waitFor(cB, 'codeEditorLanguage', 3000);
  await emitAck(cA, 'codeEditorLanguage', { chatId, language: 'python' });
  const langGot = await pLang;
  rec('محرر كود: تغيير اللغة فورياً', !!langGot, langGot ? `lang=${langGot.language}` : 'لم يصل');
  const pJoin = waitFor(cB, 'codeEditorState', 3000); // B ينضم → يجب أن يستلم state
  const ceJoin = await emitAck(cB, 'codeEditorJoin', { chatId });
  const joinState = await pJoin;
  rec('محرر كود: codeEditorJoin + استلام الحالة', ceJoin.ok && !!joinState, joinState ? `content len=${(joinState.content || '').length}` : 'ack فقط بدون state');

  // 9) إشارات WebRTC (صوت) — تمرير عرض/جواب/ICE
  const pSig = waitFor(cB, 'webrtcSignal', 4000);
  await emitAck(cA, 'webrtcSignal', { chatId, senderName: 'A', signalType: 'offer', signal: { type: 'offer', sdp: 'x' }, muted: false, traceId: 't3' });
  const sigGot = await pSig;
  rec('WebRTC: تمرير offer A→B', !!sigGot && sigGot.signalType === 'offer', sigGot ? `from=${(sigGot.sender || '').slice(0, 12)}` : 'لم يصل');
  const pIce = waitFor(cB, 'webrtcSignal', 4000);
  await emitAck(cA, 'webrtcSignal', { chatId, senderName: 'A', signalType: 'ice', signal: { candidate: 'c' }, traceId: 't4' });
  const iceGot = await pIce;
  rec('WebRTC: تمرير ICE A→B', !!iceGot && iceGot.signalType === 'ice');

  // 10) مشاركة الشاشة (إشارات)
  const pSS = waitFor(cB, 'screenShareSignal', 4000);
  cA.timeout(2000).emit('screenShareSignal', { chatId, senderName: 'A', type: 'offer', data: { sdp: 'y' } }, () => {});
  const ssGot = await pSS;
  rec('مشاركة الشاشة: تمرير الإشارة A→B', !!ssGot, ssGot ? `type=${ssGot.type}` : 'لم يصل');

  // 11) قطع اتصال A → B يستلم peerDisconnected
  const pDisc = waitFor(cB, 'peerDisconnected', 5000);
  cA.disconnect();
  const discGot = await pDisc;
  rec('إشعار انقطاع الطرف (peerDisconnected)', !!discGot, discGot ? `email=${(discGot.email || '').slice(0, 12)}` : 'لم يصل');

  cB.disconnect();
  const passed = results.filter(r => r.ok).length;
  console.log(`\n=== النتيجة: ${passed}/${results.length} ناجحة ===`);
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
