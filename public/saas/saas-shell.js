!function () {
  "use strict";

  try {
    if (!document.querySelector('script[src*="i18n.js"]')) {
      var i18nSc = document.createElement("script");
      i18nSc.src = "/i18n.js";
      document.head.appendChild(i18nSc);
    }
  } catch (e) {}

  function escapeHtml(e) {
    return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function getToken() {
    return localStorage.getItem("token") || "";
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch (_) {
      return {};
    }
  }

  function requireAuth() {
    if (!getToken()) {
      window.location.href = "/login-signup/login.html";
      return false;
    }
    return true;
  }

  async function api(endpoint, options) {
    const opts = options || {};
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    const tok = getToken();
    if (tok) headers.Authorization = "Bearer " + tok;
    const base = (window.SHARIK_CONFIG && window.SHARIK_CONFIG.API_BASE) || "";
    const res = await fetch(base + endpoint, Object.assign({}, opts, { headers }));
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      } catch (_) {}
      if (!window.location.pathname.includes("/login-signup/")) {
        window.location.href = "/login-signup/login.html?expired=1";
      }
      throw new Error(data.error || "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً");
    }

    if (!res.ok) throw new Error(data.error || "طلب فاشل");
    return data;
  }

  const navItems = [
    { href: "/app/dashboard.html", label: "لوحة التحكم", icon: "grid" },
    { href: "/app/ai-mentor.html", label: "المساعد الذكي", icon: "bot" },
    { href: "/app/roadmap.html", label: "خريطة التعلم", icon: "map" },
    { href: "/app/feed.html", label: "المجتمع", icon: "feed" },
    { href: "/app/marketplace.html", label: "سوق المهارات", icon: "shop" },
    { href: "/app/discover.html", label: "اكتشف", icon: "search" },
    { href: "/login-signup/matching-results.html", label: "المطابقة", icon: "users" },
    { href: "/app/sessions.html", label: "الجلسات", icon: "calendar" },
    { href: "/login-signup/chat.html", label: "المحادثات", icon: "chat" },
    { href: "/app/challenges.html", label: "التحديات", icon: "target" },
    { href: "/app/leaderboard.html", label: "المتصدرون", icon: "trophy" },
    { href: "/app/pricing.html", label: "باقات الاشتراك 💎", icon: "diamond" },
    { href: "/app/profile.html", label: "الملف الشخصي", icon: "user" },

    { href: "/app/notifications.html", label: "الإشعارات", icon: "bell" }
  ];

  function getIcon(name) {
    const icons = {
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15h.01M16 15h.01"/></svg>',
      map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
      feed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
      shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 6h2a3 3 0 0 1 0 6h-2M7 6H5a3 3 0 0 0 0 6h2"/></svg>',
      diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 9 12 22 22 9 12 2"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>',
      menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
      moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
    };
    return icons[name] || icons.grid;
  }

  function applyTheme(theme) {
    const isDark = theme !== "light";
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
    try { localStorage.setItem("sharik_theme", isDark ? "dark" : "light"); } catch (_) {}
    const btn = document.getElementById("saasThemeBtn");
    if (btn) btn.innerHTML = getIcon(isDark ? "moon" : "sun");
  }

  function mountShell(activeKey) {
    /* صفحة الاكتشاف متاحة للزوار (البحث جزء من تجربة التعريف بالمنصة) */
    const guestMode = activeKey === "discover" && !getToken();
    if (!guestMode && !requireAuth()) return null;

    document.body.classList.add("saas-app", "dark");
    applyTheme(localStorage.getItem("sharik_theme") || "dark");

    const u = getUser();
    const displayName = guestMode ? "زائر" : (u.name || u.username1 || u.username || "مستخدم");
    const initial = String(displayName).charAt(0).toUpperCase();
    const avatar = u.avatar ? `<img src="${escapeHtml(u.avatar)}" alt="${escapeHtml(displayName)}">` : escapeHtml(initial);

    function getNavLabel(item) {
      if (window.SharikI18N && window.SharikI18N.t) return window.SharikI18N.t(item.label);
      return item.label;
    }

    const navLinksHtml = navItems.map(item => {
      const isActive = activeKey && (item.href.includes(activeKey) || window.location.pathname.endsWith(item.href));
      return `<a href="${item.href}" class="${isActive ? "active" : ""}">${getIcon(item.icon)}<span>${escapeHtml(getNavLabel(item))}</span></a>`;
    }).join("");

    const root = document.getElementById("saas-root");
    if (!root) return null;

    root.innerHTML = `
      <div class="saas-backdrop" id="saasBackdrop"></div>
      <div class="saas-layout">
        <aside class="saas-sidebar" id="saasSidebar">
          <a class="saas-brand" href="/index.html">
            <img src="/images/logo.svg" alt="شارك">
          </a>
          <nav class="saas-nav">${navLinksHtml}</nav>
          <div class="saas-side-foot">
            <p>${guestMode ? "أنشئ حسابك وابدأ تبادل المهارات مجاناً." : "اختر مهارة جديدة لتعلمها وارفع ترتيبك الآن."}</p>
            <a class="saas-btn saas-btn-primary" style="width:100%" href="${guestMode ? "/login-signup/signup.html" : "/login-signup/skill-test.html"}">${guestMode ? "أنشئ حساب مجاني" : "اختبار المهارة"}</a>
            ${guestMode ? "" : `<button class="saas-btn saas-btn-ghost saas-logout-btn" id="saasLogoutBtn" type="button" style="width:100%;margin-top:8px;color:#f87171;border-color:rgba(239,68,68,.35)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              تسجيل الخروج
            </button>`}
          </div>
        </aside>
        <div class="saas-main">
          <header class="saas-topbar">
            <button class="saas-mobile-toggle" id="saasMenuBtn" aria-label="القائمة">${getIcon("menu")}</button>
            <form class="saas-search" id="saasSearchForm" action="/app/discover.html" method="get">
              ${getIcon("search")}
              <input name="q" type="search" placeholder="ابحث عن مهارة أو مرشد..." autocomplete="off" />
            </form>
            <div class="saas-top-actions">
              <button class="saas-icon-btn lang-toggle-btn" id="saasLangBtn" type="button" aria-label="Switch Language / تغيير اللغة" title="Switch Language" style="font-weight:800;font-size:13px;width:38px;height:38px;border-radius:10px;cursor:pointer">${(window.SharikI18N && window.SharikI18N.getLang() === "en") ? "ع" : "EN"}</button>
              <button class="saas-icon-btn" id="saasThemeBtn" aria-label="السمة">${getIcon("moon")}</button>
              <a class="saas-icon-btn" href="/app/notifications.html" aria-label="الإشعارات">
                ${getIcon("bell")}<span class="saas-badge-dot" id="notifDot" hidden></span>
              </a>
              <a class="saas-user-chip" href="/app/profile.html">
                <div class="saas-avatar">${avatar}</div>
                <span>${escapeHtml(String(displayName).split(" ")[0])}</span>
              </a>
            </div>
          </header>
          <main class="saas-content" id="saasContent"></main>
        </div>
      </div>
      <a class="saas-fab" href="/app/sessions.html" title="حجز جلسة" aria-label="حجز جلسة">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      </a>
    `;

    // Toggle menu
    document.getElementById("saasMenuBtn")?.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
    document.getElementById("saasBackdrop")?.addEventListener("click", () => {
      document.body.classList.remove("sidebar-open");
    });

    // Lang toggle
    document.getElementById("saasLangBtn")?.addEventListener("click", () => {
      if (window.SharikI18N) {
        const nextLang = window.SharikI18N.getLang() === "ar" ? "en" : "ar";
        window.SharikI18N.setLang(nextLang);
      }
    });

    document.addEventListener("shariklangchange", () => {
      const navEl = document.querySelector(".saas-nav");
      if (navEl) {
        navEl.innerHTML = navItems.map(item => {
          const isActive = activeKey && (item.href.includes(activeKey) || window.location.pathname.endsWith(item.href));
          return `<a href="${item.href}" class="${isActive ? "active" : ""}">${getIcon(item.icon)}<span>${escapeHtml(getNavLabel(item))}</span></a>`;
        }).join("");
      }
      const langBtn = document.getElementById("saasLangBtn");
      if (langBtn && window.SharikI18N) {
        langBtn.textContent = window.SharikI18N.getLang() === "ar" ? "EN" : "ع";
      }
    });

    // Theme toggle
    document.getElementById("saasThemeBtn")?.addEventListener("click", () => {
      applyTheme(document.body.classList.contains("dark") ? "light" : "dark");
    });

    // Logout
    document.getElementById("saasLogoutBtn")?.addEventListener("click", () => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      } catch (_) {}
      window.location.href = "/login-signup/login.html?loggedout=1";
    });

    // Check notifications
    api("/api/notifications").then(d => {
      const hasUnread = (d.notifications || []).some(n => !n.read);
      const dot = document.getElementById("notifDot");
      if (dot) dot.hidden = !hasUnread;
    }).catch(() => {});

    return document.getElementById("saasContent");
  }

  // Register Service Worker & Web Push
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  async function requestPushPermission() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted") return;
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-NjvKeyPublicSharik2026SecureKeyHere"
        });
        await api("/api/push/subscribe", { method: "POST", body: JSON.stringify({ subscription: sub }) });
      }
    } catch (e) {}
  }

  window.SharikSaaS = {
    escapeHtml,
    getToken,
    getUser,
    requireAuth,
    api,
    mountShell,
    applyTheme,
    requestPushPermission,
    stars: function (rating) {
      const r = Math.round(Number(rating) || 0);
      return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
    },
    icon: getIcon,
    toast: function (msg, type = "info") {
      let c = document.getElementById("saas-toast-container");
      if (!c) {
        c = document.createElement("div");
        c.id = "saas-toast-container";
        c.style.cssText = "position:fixed;bottom:24px;left:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;";
        document.body.appendChild(c);
      }
      const el = document.createElement("div");
      const colors = { success: "#10b981", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
      el.style.cssText = `background:${colors[type] || "#3b82f6"};color:white;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.3);font-family:inherit;direction:rtl;`;
      el.textContent = msg;
      c.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.3s ease";
        setTimeout(() => el.remove(), 300);
      }, 3500);
    },
    openCmdPalette: function() {
      if (document.getElementById("saasCmdOverlay")) return;
      const overlay = document.createElement("div");
      overlay.id = "saasCmdOverlay";
      overlay.className = "saas-cmd-overlay";
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
      
      const links = [
        { label: "📊 لوحة التحكم الرئيسية", href: "/app/dashboard.html" },
        { label: "💎 باقات الاشتراك والترقية", href: "/app/pricing.html" },
        { label: "🤖 المساعد الاصطناعي الذكي", href: "/app/ai-mentor.html" },
        { label: "👤 الملف الشخصي والإعدادات", href: "/app/profile.html" },
        { label: "📅 جلساتي القادمة", href: "/app/sessions.html" },
        { label: "⚡ البحث عن شريك مطابِق", href: "/login-signup/matching-results.html" },
        { label: "💬 محادثاتي المباشرة", href: "/login-signup/chat.html" },
        { label: "🗺️ خريطة مسار التعلم", href: "/app/roadmap.html" },
        { label: "🛡️ لوحة تحكم الأدمن", href: "/admin/dashboard.html" }
      ];

      overlay.innerHTML = `
        <div class="saas-cmd-box">
          <input class="saas-cmd-input" id="cmdInput" placeholder="🔍 اكتب للانتقال إلى أي صفحة... (اضغط ESC للإغلاق)" autofocus />
          <div class="saas-cmd-list" id="cmdList">
            ${links.map(l => `<div class="saas-cmd-item" onclick="location.href='${l.href}'"><span>${l.label}</span></div>`).join("")}
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const inp = document.getElementById("cmdInput");
      inp?.focus();
      inp?.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = q ? links.filter(l => l.label.toLowerCase().includes(q)) : links;
        document.getElementById("cmdList").innerHTML = filtered.length
          ? filtered.map(l => `<div class="saas-cmd-item" onclick="location.href='${l.href}'"><span>${l.label}</span></div>`).join("")
          : `<div style="padding:16px;text-align:center;color:var(--saas-muted)">لا توجد نتائج</div>`;
      });
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      window.SharikSaaS?.openCmdPalette();
    } else if (e.key === "Escape") {
      document.getElementById("saasCmdOverlay")?.remove();
    }
  });
}();


