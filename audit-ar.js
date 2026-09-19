/* AR-mode audit: dir=rtl everywhere, Arabic restored, no unintended English leftovers */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE = 'http://localhost:3000';
const ROOT = path.join(__dirname, 'public');
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    if (f === 'node_modules' || f.startsWith('.')) continue;
    const p = path.join(d, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (f.endsWith('.html') && f !== 'googleb50c5a55011801b6.html') files.push('/' + path.relative(ROOT, p).split(path.sep).join('/'));
  }
})(ROOT);
files.sort();

// Whitelisted English that may legitimately appear in AR mode
const ALLOW = /^(Audit|Audit User|\S+@\S+\.\S+|Africa\/Cairo|C\+\+|Pomodoro|TIOBE Index|Hash Tables|Stacks|Queues|Binary Trees|Recursion|Algorithms|TCP\/IP|UX\/UI|POST|GET|PUT|DELETE|PATCH|REST vs GraphQL|Closures|CSS Best Practices|async\/await|Rate Limiting|CSRF Protection|JWT Sessions|2FA Admins|Skill Exchange Platform|Request:|Response Example:|AI Services|Community Feed|Analytics|Gamification|Data Science|Mobile Apps|Cybersecurity|Web Development|Artificial Intelligence|Networking|Data Scientist|AI Engineer|Frontend Developer|Backend Developer|Sharik@gmail\.com)$/i;
const ALLOW_CONTAINS = /(^|\s)(Sharik|React|Python|JavaScript|Flutter|Dart|GitHub|Google|AWS|Azure|API|UI|UX|XP|SaaS|Figma|Kotlin|Swift|Node\.js|Next\.js|TensorFlow|PyTorch|CCNA|Cisco|ISO|GDPR|OWASP|Docker|Kubernetes|Linux|SQL|NoSQL|MongoDB|Redis|Terraform|Jenkins|Grafana|Prometheus|DevOps|Fawry|Paymob|Vodafone|WhatsApp|LinkedIn|Behance|Dribbble|Coursera|edX|Kaggle|Duolingo|Memrise|Anki|Slack|Teams|Trello|Netflix|Uber|Snapchat|Medium|GeeksforGeeks|Arabsera|SkillSwap|Stack Overflow|English|Arabic|Word(ress)?|Data Structures|Competitive Programming|Machine Learning|Deep Learning|Computer Vision|Hot Reload|User Flow|Design System|Code Editor|Real-Time|Open Source|Freelance)(\s|$|[.,·])/;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', protocolTimeout: 90000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.setRequestInterception(true);
  page.on('dialog', d => d.dismiss());
  page.on('request', req => {
    const u = req.url();
    if ((u.startsWith('http://') || u.startsWith('https://')) && !u.startsWith(BASE)) req.abort();
    else if (u.startsWith(BASE + '/api/')) {
      const body = JSON.stringify({ ok: true, user: { id: 'audit', name: 'Audit User', email: 'sharik@gmail.com', role: 'admin', teachSkills: ['React'], learnSkills: ['Design'], skills: [] }, profile: {}, stats: {}, data: {}, plans: [], skills: [], mentors: [], notifications: [], sessions: [], challenges: [], posts: [], leaderboard: [] });
      req.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body });
    } else req.continue();
  });
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('sharik_lang', 'ar');
      localStorage.setItem('token', 'audit-fake-token');
      localStorage.setItem('currentUser', JSON.stringify({ id: 'audit', name: 'Audit', role: 'admin', email: 'sharik@gmail.com' }));
    } catch (e) {}
  });

  const report = [];
  for (const f of files) {
    let finalUrl = f;
    try {
      await page.goto(BASE + f, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1500));
      finalUrl = page.url().replace(BASE, '') || '/';
    } catch (e) {
      report.push({ page: f, error: e.message.slice(0, 100) });
      continue;
    }
    const data = await page.evaluate(() => {
      const ARABIC = /[\u0600-\u06FF]/;
      const SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1, CANVAS: 1, NOSCRIPT: 1, TEMPLATE: 1 };
      const en = [];
      const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !/[a-zA-Z]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          if (ARABIC.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          let p = n.parentElement;
          while (p) { if (SKIP[p.tagName]) return NodeFilter.FILTER_REJECT; p = p.parentElement; }
          const el = n.parentElement;
          if (el) {
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
            if (el.id === 'langBtn' || el.id === 'saasLangBtn') return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n;
      while ((n = walker.nextNode())) {
        const t = n.nodeValue.trim().replace(/\s+/g, ' ');
        if (t.length >= 3) en.push({ t: t.slice(0, 120), el: (n.parentElement ? n.parentElement.tagName.toLowerCase() : '?') });
      }
      return {
        en: [...new Map(en.map(x => [x.t, x])).values()],
        dir: document.documentElement.getAttribute('dir'),
        htmlLang: document.documentElement.getAttribute('lang'),
        title: document.title || '',
        langBtn: document.getElementById('langBtn')?.textContent || document.getElementById('saasLangBtn')?.textContent || ''
      };
    }).catch(() => null);
    if (!data) { report.push({ page: f, finalUrl, error: 'eval-fail' }); continue; }
    const suspicious = data.en.filter(x => {
      const t = x.t.replace(/[\d\s\u0660-\u0669%.,:·\-–—/()'"&+✓✔✖✦●#!؟?]/g, '');
      if (!t) return false;
      if (ALLOW.test(t)) return false;
      if (ALLOW_CONTAINS.test(x.t)) return false;
      return true;
    });
    report.push({ page: f, finalUrl, dir: data.dir, htmlLang: data.htmlLang, langBtn: data.langBtn, title: data.title, suspicious });
  }

  await browser.close();
  const lines = [];
  let badDir = 0, withSuspicious = 0;
  for (const r of report) {
    if (r.error) { lines.push('ERROR ' + r.page + ' :: ' + r.error); continue; }
    if (r.dir !== 'rtl' || r.htmlLang !== 'ar') { badDir++; lines.push('DIR/LANG BUG ' + r.page + ' dir=' + r.dir + ' lang=' + r.htmlLang); }
    if (r.suspicious.length) {
      withSuspicious++;
      lines.push('\n=== ' + r.page + ' (final: ' + r.finalUrl + ') langBtn=' + JSON.stringify(r.langBtn));
      r.suspicious.slice(0, 40).forEach(x => lines.push('  [' + x.el + '] ' + x.t));
    }
  }
  fs.writeFileSync(path.join(__dirname, 'i18n-work', 'audit-ar.txt'), lines.join('\n'), 'utf8');
  console.log('Pages:', report.length, '| dir/lang bugs:', badDir, '| pages with English leftovers:', withSuspicious);
})();
