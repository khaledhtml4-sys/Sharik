const fs = require('fs');

const BOOT = (activeKey) => `
<div id="saas-root"></div><script src="/saas/saas-shell.js?v=2" defer><\/script><script>
(function () {
  function boot() {
    var S = window.SharikSaaS;
    if (!S) return;
    var content = S.mountShell("${activeKey}");
    if (!content) return;
    var main = document.querySelector("body > main");
    if (main) content.appendChild(main);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
<\/script>`;

function convert(file, activeKey) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s.length;

  // 1) body class
  if (!s.includes('<body class="dark saas-app">')) {
    s = s.replace('<body class="dark">', '<body class="dark saas-app">');
  }

  // 2) drop static public header
  const headerRe = /<header id="header">[\s\S]*?<\/header>/;
  if (!headerRe.test(s)) throw new Error(file + ': static header not found');
  s = s.replace(headerRe, '');

  // 3) swap unified-header.js for the saas shell + boot
  const uhRe = /<script src="\/unified-header\.js[^"]*"\s*defer><\/script>/;
  if (!uhRe.test(s)) throw new Error(file + ': unified-header.js tag not found');
  s = s.replace(uhRe, BOOT(activeKey));

  // 4) swap its css for the shell css
  if (!s.includes('/unified-header.css')) throw new Error(file + ': unified-header.css not found');
  s = s.replace('<link rel="stylesheet" href="/unified-header.css">', '<link rel="stylesheet" href="/saas/saas.css">');

  // 5) drop the static public footer
  const footerRe = /<footer class="footer"[^>]*>[\s\S]*?<\/footer>/;
  if (!footerRe.test(s)) throw new Error(file + ': static footer not found');
  s = s.replace(footerRe, '');

  fs.writeFileSync(file, s);
  console.log(file, 'converted:', before, '->', s.length, 'chars');
}

convert('login-signup/chat.html', 'chat');
convert('login-signup/matching-results.html', 'matching-results');
