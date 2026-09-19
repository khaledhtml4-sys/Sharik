/* Full-site EN-mode audit: load every page with sharik_lang=en, collect remaining Arabic */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE = 'http://localhost:3000';
const ROOT = path.join(__dirname, 'public');
const AR = /[\u0600-\u06FF\u0750-\u077F]/;
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
      localStorage.setItem('sharik_lang', 'en');
      localStorage.setItem('token', 'audit-fake-token');
      localStorage.setItem('currentUser', JSON.stringify({ id: 'audit', name: 'Audit', role: 'admin', email: 'sharik@gmail.com' }));
    } catch (e) {}
  });

  const report = [];
  let totalArabic = 0;
  const seenUrls = new Set();

  for (const f of files) {
    let finalUrl = f;
    try {
      await page.goto(BASE + f, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1300));
      finalUrl = page.url().replace(BASE, '') || '/';
    } catch (e) {
      report.push({ page: f, error: e.message.slice(0, 100) });
      continue;
    }
    const first = !seenUrls.has(finalUrl);
    seenUrls.add(finalUrl);

    let data;
    try {
      data = await page.evaluate(() => {
        const AR = /[\u0600-\u06FF\u0750-\u077F]/;
        const SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1, CANVAS: 1, NOSCRIPT: 1, TEMPLATE: 1 };
        const texts = [];
        const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
          acceptNode(n) {
            if (!n.nodeValue || !AR.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
            let p = n.parentElement;
            while (p) {
              if (SKIP[p.tagName]) return NodeFilter.FILTER_REJECT;
              if (p.id === 'langBtn' || p.id === 'saasLangBtn') return NodeFilter.FILTER_REJECT;
              p = p.parentElement;
            }
            // skip invisible nodes
            const el = n.parentElement;
            if (el) {
              const cs = getComputedStyle(el);
              if (cs.display === 'none' || cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        let n;
        while ((n = walker.nextNode())) texts.push({ t: n.nodeValue.trim().replace(/\s+/g, ' ').slice(0, 160), el: (n.parentElement ? n.parentElement.tagName.toLowerCase() + (n.parentElement.className && typeof n.parentElement.className === 'string' ? '.' + n.parentElement.className.split(/\s+/).slice(0, 2).join('.') : '') : '?') });
        const attrs = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.id === 'langBtn' || el.id === 'saasLangBtn' || (el.classList && el.classList.contains('lang-toggle-btn'))) return;
          for (const a of ['placeholder', 'title', 'aria-label', 'alt']) {
            const v = el.getAttribute && el.getAttribute(a);
            if (v && AR.test(v)) attrs.push(a + ': ' + v.trim().replace(/\s+/g, ' ').slice(0, 120));
          }
        });
        const dir = document.documentElement.getAttribute('dir');
        return {
          texts: [...new Map(texts.map(x => [x.t, x])).values()],
          attrs: [...new Set(attrs)],
          title: document.title || '',
          metaDesc: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          dir,
          htmlLang: document.documentElement.getAttribute('lang'),
          langBtn: document.getElementById('langBtn')?.textContent || document.getElementById('saasLangBtn')?.textContent || ''
        };
      });
    } catch (e) {
      report.push({ page: f, finalUrl, error: 'EVAL ' + e.message.slice(0, 80) });
      continue;
    }

    const arabicCount = data.texts.length + data.attrs.length + (AR.test(data.title) ? 1 : 0);
    totalArabic += arabicCount;
    report.push({ page: f, finalUrl, dir: data.dir, lang: data.htmlLang, langBtn: data.langBtn, title: data.title, titleHasAr: AR.test(data.title), metaHasAr: AR.test(data.metaDesc), texts: data.texts, attrs: data.attrs, count: arabicCount });
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'i18n-work', 'audit-en.json'), JSON.stringify(report, null, 1), 'utf8');

  const lines = [];
  let pagesWithIssues = 0;
  for (const r of report) {
    if (r.error) { lines.push('ERROR ' + r.page + ' :: ' + r.error); continue; }
    const issues = (r.texts || []).length + (r.attrs || []).length + (r.titleHasAr ? 1 : 0);
    if (issues > 0) {
      pagesWithIssues++;
      lines.push('\n=== ' + r.page + ' (final: ' + r.finalUrl + ') dir=' + r.dir + ' langBtn=' + JSON.stringify(r.langBtn) + ' issues=' + issues);
      if (r.titleHasAr) lines.push('  TITLE-AR: ' + r.title);
      (r.texts || []).slice(0, 60).forEach(x => lines.push('  [' + x.el + '] ' + x.t));
      (r.attrs || []).slice(0, 20).forEach(a => lines.push('  ATTR ' + a));
    }
  }
  fs.writeFileSync(path.join(__dirname, 'i18n-work', 'audit-en.txt'), lines.join('\n'), 'utf8');
  console.log('Pages:', report.length, '| pages with remaining Arabic:', pagesWithIssues, '| total remaining strings:', totalArabic);
})();
