const fs = require('fs'), path = require('path');
const root = process.cwd();
const files = [];
(function walk(d){ for(const f of fs.readdirSync(d)){ const p=path.join(d,f); const s=fs.statSync(p); if(s.isDirectory()){ if(!['node_modules','images','img'].includes(f)) walk(p);} else if(f.endsWith('.html')) files.push(path.relative(root,p).split(path.sep).join('/')); } })(root);
files.sort();
const rows = files.map(f => {
  const html = fs.readFileSync(f,'utf8');
  return {
    f,
    lang: /<html[^>]*lang="(ar|en)"/.exec(html)?.[1] || 'MISSING',
    dir: /<html[^>]*dir="(rtl|ltr)"/.exec(html)?.[1] || 'MISSING',
    uh: html.includes('unified-header.js'),
    uhc: html.includes('unified-header.css'),
    footer: /<footer[^>]*class="footer"/.test(html),
    tria: html.includes('tria-theme.css'),
    ui: html.includes('ui-system.css'),
    noindex: /noindex/.test(html),
    title: /<title>([^<]*)<\/title>/.exec(html)?.[1]?.slice(0,45) || 'MISSING'
  };
});
console.log('FILE | lang | dir | unifHdrJS | unifHdrCSS | footer | tria | uiSys | noindex');
for(const r of rows) console.log(`${r.f} | ${r.lang} | ${r.dir} | ${r.uh?'Y':'-'} | ${r.uhc?'Y':'-'} | ${r.footer?'Y':'-'} | ${r.tria?'Y':'-'} | ${r.ui?'Y':'-'} | ${r.noindex?'Y':'-'}`);
console.log('\nTotal pages:', files.length);
