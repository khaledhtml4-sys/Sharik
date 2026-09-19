/* Audit: every HTML page × i18n keys coverage */
const fs = require('fs'), path = require('path');
const root = __dirname;

// Load DICT keys from i18n.js by evaluating it in a fake window/document context
global.window = { location: { hostname: 'localhost' } };
global.document = {
  documentElement: { setAttribute(){} },
  addEventListener(){}, dispatchEvent(){},
  readyState: 'loading',
  querySelectorAll(){ return []; }
};
global.localStorage = { getItem(){return null}, setItem(){} };
global.navigator = { language: 'ar' };
global.CustomEvent = class {};
const src = fs.readFileSync(path.join(root,'i18n.js'),'utf8');
eval(src);
const DICT = null;
// re-eval to capture DICT via SharikI18N.t fallback: t(key) returns key if missing
const missingIn = (lang, key) => {
  const before = SharikI18N.getLang();
  // temporarily cannot set lang directly; instead parse via t() with lang switch
  return null;
};
// Simpler: regex-extract the two dict blocks
const enBlock = src.slice(src.indexOf('en: {'), src.indexOf('ar: {'));
const arBlock = src.slice(src.indexOf('ar: {'), src.indexOf('var current'));
const keys = (block) => new Set([...block.matchAll(/"([a-zA-Z0-9_.\-]+)"\s*:/g)].map(m=>m[1]));
const EN = keys(enBlock), AR = keys(arBlock);

// collect pages
const files = [];
(function walk(d){ for(const f of fs.readdirSync(d)){ if(f==='node_modules') continue; const p=path.join(d,f); const s=fs.statSync(p); if(s.isDirectory()) walk(p); else if(f.endsWith('.html')) files.push(path.relative(root,p).split(path.sep).join('/')); } })(root);
files.sort();

let problems = 0;
const report = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(root,f),'utf8');
  const used = [...html.matchAll(/data-i18n(?:-placeholder|-aria)?="([^"]+)"/g)].map(m=>m[1]);
  const missingEn = [...new Set(used)].filter(k=>!EN.has(k));
  const missingAr = [...new Set(used)].filter(k=>!AR.has(k));
  const hasI18n = html.includes('i18n.js');
  const dupes = used.filter((k,i)=>used.indexOf(k)!==i);
  if (missingEn.length || missingAr.length || !hasI18n || dupes.length) {
    problems++;
    report.push({f, hasI18n, missingEn, missingAr, dupes:[...new Set(dupes)], usedCount: used.length});
  }
}
console.log('Pages scanned:', files.length);
console.log('Pages with i18n problems:', problems);
for (const r of report) {
  console.log('\n=== ' + r.f + ' (uses ' + r.usedCount + ' keys, i18n.js: ' + (r.hasI18n?'Y':'N') + ')');
  if (r.missingEn.length) console.log('  MISSING in EN dict:', r.missingEn.join(', '));
  if (r.missingAr.length) console.log('  MISSING in AR dict:', r.missingAr.join(', '));
  if (r.dupes.length) console.log('  duplicate keys on page:', r.dupes.join(', '));
}
// also: keys defined in dict but never used anywhere
const allUsed = new Set();
for (const f of files){ const html=fs.readFileSync(path.join(root,f),'utf8'); [...html.matchAll(/data-i18n(?:-placeholder|-aria)?="([^"]+)"/g)].forEach(m=>allUsed.add(m[1])); }
const unusedEn=[...EN].filter(k=>!allUsed.has(k)), unusedAr=[...AR].filter(k=>!allUsed.has(k));
console.log('\nEN keys never used on any page ('+unusedEn.length+'):', unusedEn.join(', ')||'none');
console.log('AR keys never used on any page ('+unusedAr.length+'):', unusedAr.join(', ')||'none');
// EN/AR key set mismatch
const onlyEn=[...EN].filter(k=>!AR.has(k)), onlyAr=[...AR].filter(k=>!EN.has(k));
console.log('\nKeys only in EN:', onlyEn.join(', ')||'none');
console.log('Keys only in AR:', onlyAr.join(', ')||'none');
