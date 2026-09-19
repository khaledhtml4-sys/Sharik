!function () {
  "use strict";

  try {
    if (!document.querySelector('script[src*="/i18n.js"]')) {
      var i18nSc = document.createElement("script");
      i18nSc.src = "/i18n.js";
      document.head.appendChild(i18nSc);
    }
  } catch (e) {}

  function I18N() { return window.SharikI18N || { t: function (k) { return k; } }; }

  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="4.22"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

  /* القائمة الموحدة — تُفرض على كل الصفحات حتى لا تبقى روابط إنجليزية قديمة */
  const NAV_LINKS = [
    { href: "/index.html", key: "nav.home", match: ["/index.html", "/"] },
    { href: "/work/work.html", key: "nav.how", match: ["/work/"] },
    { href: "/blogs/blogs.html", key: "nav.blog", match: ["/blogs/"] },
    { href: "/Matching/matching.html", key: "nav.match", match: ["/matching/"] }
  ];

  function currentPath() {
    let p = (window.location.pathname || "").toLowerCase();
    p = p.replace(/\/+/g, "/");
    if (p.endsWith("/index.html")) p = p.slice(0, -10) + "index.html";
    return p;
  }

  function activeHref() {
    const p = currentPath();
    for (const link of NAV_LINKS) {
      if (link.match.some(m => (m === "/" ? p === "/" || p === "/index.html" : p.includes(m)))) {
        return link.href;
      }
    }
    return null;
  }

  function normalizeNav() {
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    const active = activeHref();
    nav.innerHTML = NAV_LINKS.map(l => {
      const isActive = active === l.href ? " class=\"active\"" : "";
      return `<a href="${l.href}"${isActive}>${I18N().t(l.key)}</a>`;
    }).join("");
  }

  /* الفوتر الموحد بالعربية */
  const SOCIALS = [
    { label: "WhatsApp", href: "https://wa.me/201283931083", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#FFFFFF" d="M17.5 14.3c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 .1-.2-.8-.4-.9-.7-1.2-.3-.3-.6-.2-.8-.1-.2.1-.5.1-.7-.2-.2-.3-.8-.9-1-1.7-.2-.8 0-1 .2-1.2.2-.2.3-.4.3-.6 0-.2-.1-.4-.2-.6-.1-.2-.9-2.2-1.2-3-.3-.8-.6-.7-.8-.7h-.7c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 1.3.6 2.2.9 2.9 1.1.9.3 1.7.3 2.3.2.7-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3z"/></svg>' },
    { label: "Facebook", href: "/footer/Contact_us.html", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#FFFFFF" d="M15.5 8.5H14c-.6 0-1 .4-1 1V11h2.5l-.3 2.5H13V19h-2.5v-5.5H8V11h2.5V9.2c0-2 1.2-3.2 3.3-3.2h1.7v2.5z"/></svg>' },
    { label: "Instagram", href: "/footer/Contact_us.html", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><radialGradient id="igGrad-uh" cx="30%" cy="30%" r="80%"><stop offset="0%" stop-color="#fdf497"/><stop offset="50%" stop-color="#fd5949"/><stop offset="100%" stop-color="#d6249f"/></radialGradient></defs><circle cx="12" cy="12" r="12" fill="url(#igGrad-uh)"/><path fill="#FFFFFF" d="M12 7.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.8a3 3 0 110-6 3 3 0 010 6zm5.4-8.2a1 1 0 11-2 0 1 1 0 012 0z"/></svg>' },
    { label: "TikTok", href: "/footer/Contact_us.html", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#000000"/><path fill="#FFFFFF" d="M15.5 7.5c.8 1.1 2 1.9 3.5 2v2.5c-1.3-.1-2.5-.5-3.5-1.2v4.8c0 2.6-2.1 4.7-4.7 4.7S6.1 18.2 6.1 15.6s2.1-4.7 4.7-4.7c.3 0 .6 0 .9.1v2.6c-.3-.1-.6-.1-.9-.1-1.2 0-2.1.9-2.1 2.1s.9 2.1 2.1 2.1 2.1-.9 2.1-2.1V4h2.5c.1 1 .7 2.4 2.1 3.5z"/></svg>' },
    { label: "X", href: "/footer/Contact_us.html", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1DA1F2"/><path fill="#FFFFFF" d="M17.8 7.6h-1.9l-2.1 2.6-2-2.6H7.6l3.2 4.2-3.4 4.6h1.9l2.3-2.9 2.2 2.9h4.2l-3.4-4.5 3.2-4.3zm-1.2 7.6h-1.1l-4.7-6.4h1.2l4.6 6.4z"/></svg>' }
  ];

  function footerHTML() {
    const socials = SOCIALS.map(s =>
      `<a href="${s.href}" aria-label="${s.label}" rel="noopener noreferrer" title="${s.label}">${s.icon}</a>`
    ).join("");
    const tt = I18N().t;
    return `
    <div class="footer-main">
      <div class="footer-brand">
        <a href="/index.html" aria-label="شارك — الرئيسية"><img src="/images/logo.svg" alt="شارك" loading="lazy" width="180" height="46"></a>
        <p>${tt("f.tag")}</p>
        <div class="footer-social">${socials}</div>
      </div>
      <div class="footer-col">
        <h4>${tt("f.important")}</h4>
        <div class="fl-line"></div>
        <a href="/index.html">${tt("f.home")}</a>
        <a href="/work/work.html">${tt("f.how")}</a>
        <a href="/blogs/blogs.html">${tt("f.blog")}</a>
        <a href="/Matching/matching.html">${tt("f.match")}</a>
      </div>
      <div class="footer-col">
        <h4>${tt("f.resources")}</h4>
        <div class="fl-line"></div>
        <a href="/footer/FAQ.html">${tt("f.faq")}</a>
        <a href="/footer/help_center.html">${tt("f.help")}</a>
        <a href="/footer/About_Us.html">${tt("f.about")}</a>
        <a href="/footer/Contact_us.html">${tt("f.contactus")}</a>
      </div>
      <div class="footer-col">
        <h4>${tt("f.contact")}</h4>
        <div class="fl-line"></div>
        <p class="f-plain">${tt("f.location")}</p>
        <a href="mailto:sharik@gmail.com">Sharik@gmail.com</a>
        <a href="tel:+201283931083"><span dir="ltr">0128 393 1083</span></a>
        <a href="tel:+201006843165"><span dir="ltr">0100 684 3165</span></a>
      </div>
    </div>
    <div class="footer-copyright">${tt("f.rights")}</div>`;
  }

  function normalizeFooter() {
    const footer = document.querySelector("footer.footer");
    if (!footer) return;
    footer.innerHTML = footerHTML();
    footer.dataset.unified = "1";
  }

  function ensureCairoFont() {
    if (document.querySelector('link[data-font="cairo"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.dataset.font = "cairo";
    link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }

  function injectFloatCta() {
    if (!document.querySelector(".tria-float-cta")) {
      const a = document.createElement("a");
      a.className = "tria-float-cta";
      a.href = "/login-signup/signup.html";
      a.innerHTML = "✦ ابدأ مجاناً";
      document.body.appendChild(a);
    }
    if (!document.querySelector(".tria-float-wa")) {
      const wa = document.createElement("a");
      wa.className = "tria-float-wa";
      wa.href = "https://wa.me/201283931083?text=" + encodeURIComponent("أهلاً شارك، عندي استفسار عن المنصة");
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.setAttribute("aria-label", "تواصل واتساب");
      wa.title = "تواصل معنا واتساب";
      wa.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.2-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.8.4a3.4 3.4 0 0 0-1 2.5c0 1.5 1 2.9 1.2 3.1a11 11 0 0 0 4.6 4c.6.3 1.1.4 1.5.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2 0-.1-.2-.2-.5-.3z"/></svg>';
      document.body.appendChild(wa);
    }
  }

  function getSavedTheme() {
    try { return localStorage.getItem("sharik_theme") || "dark"; } catch (_) { return "dark"; }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("themeBtn");
    if (btn) btn.innerHTML = isDark ? moonSvg : sunSvg;
    try { localStorage.setItem("sharik_theme", theme); } catch (_) {}
  }

  window.applyTheme = applyTheme;
  window.initTheme = function () { applyTheme(getSavedTheme()); };

  function initHeader() {
    if (!window.SharikI18N) { setTimeout(initHeader, 25); return; }
    if (window.__sharikHeaderBooted) return;
    window.__sharikHeaderBooted = true;
    applyTheme(getSavedTheme());
    ensureCairoFont();
    normalizeNav();
    normalizeFooter();
    injectFloatCta();

    // Check auth state
    const token = localStorage.getItem("token");
    const currentUser = (() => { try { return JSON.parse(localStorage.getItem("currentUser") || "{}"); } catch (_) { return {}; } })();
    const isAdmin = currentUser.role === "admin" || currentUser.role === "super_admin" || (currentUser.email && currentUser.email.toLowerCase() === "sharik@gmail.com");

    const actions = document.querySelector("#header .header-actions");

    // زر تبديل اللغة (يُحقن تلقائياً في كل الصفحات)
    const tt = I18N().t;
    let langBtn = document.getElementById("langBtn");
    if (!langBtn && actions) {
      const a = document.createElement("button");
      a.id = "langBtn";
      a.type = "button";
      a.className = "lang-btn";
      a.setAttribute("aria-label", "Switch language / تغيير اللغة");
      actions.insertBefore(a, actions.firstChild);
      langBtn = a;
    }
    if (langBtn) {
      langBtn.textContent = I18N().getLang() === "ar" ? "EN" : "ع";
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        I18N().setLang(I18N().getLang() === "ar" ? "en" : "ar");
      });
    }

    const signupBtnA = document.querySelector('#header .header-actions a[href*="signup"]');
    if (signupBtnA) {
      const b = signupBtnA.querySelector(".btn-login");
      if (b) b.textContent = tt("cta.start");
    }
    const loginBtnA = document.querySelector('#header .header-actions a[href*="login.html"]');
    if (loginBtnA && !loginBtnA.querySelector("[href*='signup']")) {
      const lb = loginBtnA.querySelector(".btn-login");
      if (lb && lb.textContent.indexOf("دخول") !== -1) lb.textContent = tt("cta.login");
    }
    if (actions && token) {
      document.querySelectorAll("#header .header-actions a[href*='login'], #header .header-actions a[href*='signup']").forEach(el => el.remove());
      if (!document.getElementById("saasDashLink")) {
        const dashBtn = document.createElement("a");
        dashBtn.id = "saasDashLink";
        dashBtn.href = isAdmin ? "/admin/dashboard.html" : "/app/dashboard.html";
        dashBtn.className = "btn-login";
        dashBtn.textContent = I18N().t(isAdmin ? "cta.admin" : "cta.dashboard");
        actions.insertBefore(dashBtn, actions.firstChild);
      }
    }

    // Toggle menu
    const nav = document.getElementById("mainNav");
    const menuBtn = document.getElementById("menuBtn");
    const themeBtn = document.getElementById("themeBtn");

    if (menuBtn && nav) {
      function toggleMenu(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const isOpen = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
      menuBtn.addEventListener("click", toggleMenu);
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          nav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (themeBtn) {
      themeBtn.innerHTML = getSavedTheme() === "dark" ? moonSvg : sunSvg;
      themeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyTheme(document.body.classList.contains("dark") ? "light" : "dark");
      });
    }

    // Close menu on click outside
    document.addEventListener("click", (e) => {
      if (nav && nav.classList.contains("open") && !e.target.closest("#mainNav") && !e.target.closest("#menuBtn")) {
        nav.classList.remove("open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("shariklangchange", function () {
    normalizeNav();
    normalizeFooter();
    var langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.textContent = I18N().getLang() === "ar" ? "EN" : "ع";
    var signupBtnA = document.querySelector('#header .header-actions a[href*="signup"]');
    if (signupBtnA) {
      var b = signupBtnA.querySelector(".btn-login");
      if (b) b.textContent = I18N().t("cta.start");
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader);
  } else {
    initHeader();
  }
  // إن اكتمل i18n بعدنا، أعد بناء الهيدر مرة واحدة
  document.addEventListener("shariki18nready", function () {
    if (!window.__sharikHeaderBooted) initHeader();
  }, { once: true });
}();
