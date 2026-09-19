const fs = require('fs'), path = require('path');
const root = process.cwd();
const files = [];
(function walk(d){ for(const f of fs.readdirSync(d)){ const p=path.join(d,f); const s=fs.statSync(p); if(s.isDirectory()){ if(!['node_modules'].includes(f)) walk(p);} else if(f.endsWith('.html')) files.push(path.relative(root,p).split(path.sep).join('/')); } })(root);

function exists(rel, fromDir){
  // strip query/hash
  rel = rel.split('#')[0].split('?')[0];
  if(!rel) return true;
  let target;
  if(rel.startsWith('/')) target = path.join(root, rel);
  else target = path.join(root, fromDir, rel);
  target = path.normalize(target);
  if(!target.startsWith(path.normalize(root))) return true; // external
  return fs.existsSync(target);
}

const broken = {};
const external = new Set();
for(const f of files){
  const html = fs.readFileSync(f,'utf8');
  const fromDir = path.dirname(f);
  const re = /(?:href|src)="([^"#]+)(?:#[^"]*)?"/g;
  let m;
  while((m = re.exec(html))){
    const url = m[1];
    if(/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('tel:')) { if(/https?:\/\//.test(url)) external.add(url.split('/')[2]); continue; }
    if(url.endsWith('.html') || url.includes('.html')){
      if(!exists(url, fromDir)){
        (broken[f] = broken[f] || []).push(url);
      }
    }
  }
}
console.log('=== BROKEN INTERNAL HTML LINKS ===');
for(const f of Object.keys(broken)) console.log(f, '->', [...new Set(broken[f])].join(', '));
if(!Object.keys(broken).length) console.log('(none)');

// Sitemap coverage
const sm = fs.readFileSync('sitemap.xml','utf8');
const smUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replace(/^https?:\/\/[^/]+/,'').replace(/\/$/,'')||'/index.html');
const actual = new Set(files.map(f=>'/'+f));
console.log('\n=== IN SITEMAP BUT NO FILE ===');
for(const u of smUrls){ const p = u==='/'?'/index.html':u; if(!actual.has(p)) console.log(u); }
console.log('\n=== FILE NOT IN SITEMAP ===');
const smSet = new Set(smUrls.map(u=>u==='/'?'/index.html':u));
for(const f of files){ if(!smSet.has('/'+f) && !f.includes('googleb')) console.log('/'+f); }
