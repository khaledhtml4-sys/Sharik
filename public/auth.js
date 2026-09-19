(!(function () {
  if (!window.SHARIK_CONFIG) {
    var e =
      ("undefined" != typeof localStorage &&
        localStorage.getItem("SHARIK_API_BASE")) ||
      "https://robust-dedication-production-d794.up.railway.app";
    ((window.SHARIK_CONFIG = { API_BASE: e.replace(/\/$/, "") }),
      (window.apiUrl = function (e) {
        var t = "/" === e.charAt(0) ? e : "/" + e;
        return window.SHARIK_CONFIG.API_BASE + t;
      }));
  }
})(),
  document.addEventListener("DOMContentLoaded", () => {
    function e() {
      const e = document.querySelector(".header-actions");
      if (!e) return;
      const t = localStorage.getItem("currentUser"),
        o = localStorage.getItem("token");
      let n = e.querySelector("a[href*='login.html'], a[href*='signup.html']"),
        r = document.getElementById("authProfileMenu");
      if (t && o) {
        let i;
        try {
          i = JSON.parse(t);
        } catch (e) {
          i = {};
        }
        if (
          (n && (n.style.display = "none"),
          document.getElementById("saasDashLink") &&
            document.getElementById("saasDashLink").remove(),
          !r)
        ) {
          ((r = document.createElement("div")),
            (r.id = "authProfileMenu"),
            (r.className = "profile-menu-container"));
          const t = i.photo || i.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%230d6efd'/%3E%3Ccircle cx='12' cy='9' r='4' fill='%23fff'/%3E%3Cpath d='M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8' fill='%23fff'/%3E%3C/svg%3E";
          let n = i.username1
            ? (i.username1 + " " + (i.username2 || "")).trim()
            : i.username || i.name || "المستخدم";
          const s =
            "admin" === i.role ||
            "super_admin" === i.role ||
            (i.email && "sharik@gmail.com" === i.email.toLowerCase());
          ((r.innerHTML = `\n<div class="profile-trigger" id="profileTrigger" style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 5px 12px; border-radius: 25px; background: var(--bg-color, #f0f4fb); border: 1px solid var(--border-color, #e1e4e8); color: var(--text-color, #333); transition: all 0.3s ease;">\n<div style="width: 32px; height: 32px; border-radius: 50%; background: #0d6efd; color: white; display: flex; justify-content: center; align-items: center; font-weight: bold; font-family: 'Tajawal', sans-serif; overflow: hidden;">\n<img src="${t}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; display: ${i.photo || i.avatar ? "block" : "none"};">\n<span style="display: ${i.photo || i.avatar ? "none" : "block"};">${n.charAt(0).toUpperCase()}</span>\n</div>\n<span style="font-weight: 600; font-family: 'Tajawal', sans-serif; font-size: 14px; margin: 0 4px;">${n}</span>\n<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>\n</div>\n<div class="profile-dropdown" id="profileDropdown" style="display: none; position: absolute; top: calc(100% + 10px); left: 0; background: var(--bg-color, #fff); border: 1px solid var(--border-color, #e1e4e8); border-radius: 12px; padding: 8px; min-width: 180px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; direction: rtl;">\n${s ? '\n<a href="/admin/dashboard.html" style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; color: #10b981; text-decoration: none; border-radius: 8px; font-family: \'Tajawal\', sans-serif; font-size: 14px; font-weight: 500; transition: background 0.2s;">\n<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/></svg>\nلوحة تحكم الإدارة\n</a>\n<hr style="margin: 6px 0; border: none; border-top: 1px solid var(--border-color, #e1e4e8);">\n' : '\n<a href="/app/dashboard.html" style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; color: var(--text-color, #333); text-decoration: none; border-radius: 8px; font-family: \'Tajawal\', sans-serif; font-size: 14px; font-weight: 500; transition: background 0.2s;">\n<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>\nلوحة التحكم\n</a>\n<hr style="margin: 6px 0; border: none; border-top: 1px solid var(--border-color, #e1e4e8);">\n'}\n<a href="/app/profile.html" style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; color: var(--text-color, #333); text-decoration: none; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 14px; font-weight: 500; transition: background 0.2s;">\n<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>\nالملف الشخصي\n</a>\n<hr style="margin: 6px 0; border: none; border-top: 1px solid var(--border-color, #e1e4e8);">\n<button id="logoutBtn" style="display: flex; align-items: center; gap: 8px; width: 100%; text-align: right; padding: 10px 12px; background: none; border: none; color: #ff4d4f; cursor: pointer; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 14px; font-weight: 600; transition: background 0.2s;">\n<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>\nتسجيل الخروج\n</button>\n</div>\n`),
            (r.style.position = "relative"));
          const a = r.querySelector("#profileTrigger");
          (a.addEventListener("mouseenter", () => {
            a.style.opacity = "0.8";
          }),
            a.addEventListener("mouseleave", () => {
              a.style.opacity = "1";
            }));
          const l = r.querySelector("a"),
            d = r.querySelector("#logoutBtn");
          [l, d].forEach((e) => {
            (e &&
              e.addEventListener("mouseenter", () => {
                e.style.backgroundColor = "rgba(0,0,0,0.05)";
              }),
              e &&
                e.addEventListener("mouseleave", () => {
                  e.style.backgroundColor = "transparent";
                }));
          });
          const p = document.createElement("div");
          ((p.id = "authNotifMenu"),
            (p.className = "notif-menu-container"),
            (p.style.position = "relative"),
            (p.innerHTML =
              '\n<div class="notif-trigger" id="notifTrigger" style="position: relative; cursor: pointer; padding: 6px; border-radius: 50%; background: var(--bg-color, #f0f4fb); border: 1px solid var(--border-color, #e1e4e8); color: var(--text-color, #333); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">\n<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>\n<span id="notifBadge" style="display:none; position: absolute; top: -2px; right: -2px; background: #ff4d4f; color: white; font-size: 10px; font-weight: bold; width: 16px; height: 16px; border-radius: 50%; align-items: center; justify-content: center; font-family: sans-serif;">0</span>\n</div>\n<div class="notif-dropdown" id="notifDropdown" style="display: none; position: absolute; top: calc(100% + 10px); left: 0; background: var(--bg-color, #fff); border: 1px solid var(--border-color, #e1e4e8); border-radius: 12px; min-width: 250px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; direction: rtl; overflow: hidden;">\n<div style="padding: 12px; border-bottom: 1px solid var(--border-color, #e1e4e8); font-weight: bold; font-family: \'Tajawal\', sans-serif;">الإشعارات</div>\n<div id="notifContent" style="max-height:300px; overflow-y:auto;">\n<p style="padding:15px;text-align:center;color:#666;font-size:13px;margin:0;">جاري تحميل الإشعارات...</p>\n</div>\n</div>\n'));
          const c = async () => {
            const e = document.getElementById("notifContent"),
              t = document.getElementById("notifBadge");
            if (e) {
              e.innerHTML =
                '<p style="padding:15px;text-align:center;color:#666;font-size:13px;margin:0;">جاري تحميل الإشعارات...</p>';
              try {
                const n = await fetch(apiUrl("/api/notifications"), {
                    headers: { Authorization: `Bearer ${o}` },
                  }),
                  r = await n.json();
                if (n.ok && r.notifications) {
                  const o = r.notifications.filter((e) => !e.read).length;
                  (t &&
                    (o > 0
                      ? ((t.style.display = "flex"), (t.textContent = o))
                      : (t.style.display = "none")),
                    0 === r.notifications.length
                      ? (e.innerHTML =
                          '<p style="padding:15px;text-align:center;color:#666;font-size:13px;margin:0;">لا توجد إشعارات جديدة</p>')
                      : (e.innerHTML = r.notifications
                          .map(
                            (e) =>
                              `\n<a href="#" style="display: flex; flex-direction: column; padding: 10px 12px; color: var(--text-color, #333); text-decoration: none; border-bottom: 1px solid var(--border-color, #e1e4e8); font-family: 'Tajawal', sans-serif; font-size: 13px; transition: background 0.2s; background: ${e.read ? "transparent" : "rgba(13, 110, 253, 0.05)"};">\n<div style="font-weight: 600; color: ${"success" === e.type ? "#10b981" : "#0d6efd"}; margin-bottom: 4px;">${e.title || "إشعار"}</div>\n<div style="color: #666; font-size: 12px;">${e.message || "..."}</div>\n<small style="color: #999; font-size: 10px; margin-top:4px;">${new Date(e.date).toLocaleDateString()}</small>\n</a>\n`,
                          )
                          .join("")));
                } else
                  e.innerHTML =
                    '<p style="padding:15px;text-align:center;color:#666;font-size:13px;margin:0;">لا توجد إشعارات حالياً</p>';
              } catch (t) {
                (console.error("Failed to load notifications"),
                  (e.innerHTML =
                    '<p style="padding:15px;text-align:center;color:#666;font-size:13px;margin:0;">تعذر تحميل الإشعارات</p>'));
              }
            }
          };
          !(function () {
            const e = document.getElementById("notifContent");
            e &&
              (e.innerHTML =
                '<p style="padding:15px;text-align:center;color:#666;font-size:13px;margin:0;">اضغط لعرض الإشعارات</p>');
          })();
          const f = p.querySelector("#notifTrigger");
          (f.addEventListener("mouseenter", () => {
            f.style.background = "rgba(0,0,0,0.05)";
          }),
            f.addEventListener("mouseleave", () => {
              f.style.background = "var(--bg-color, #f0f4fb)";
            }));
          const g = p.querySelector("#notifDropdown");
          f.addEventListener("click", (e) => {
            e.stopPropagation();
            const t = "block" === g.style.display;
            (r.querySelector("#profileDropdown") &&
              (r.querySelector("#profileDropdown").style.display = "none"),
              (g.style.display = t ? "none" : "block"),
              t || c());
          });
          const y = e.querySelector(".theme-switcher");
          y
            ? (e.insertBefore(r, y), e.insertBefore(p, r))
            : (e.appendChild(p), e.appendChild(r));
          const u = r.querySelector("#profileDropdown");
          (a.addEventListener("click", (e) => {
            e.stopPropagation();
            const t = "block" === u.style.display;
            ((g.style.display = "none"),
              (u.style.display = t ? "none" : "block"),
              (a.style.borderColor = t
                ? "var(--border-color, #e1e4e8)"
                : "#0d6efd"));
          }),
            document.addEventListener("click", () => {
              ((u.style.display = "none"),
                (g.style.display = "none"),
                (a.style.borderColor = "var(--border-color, #e1e4e8)"));
            }),
            d.addEventListener("click", () => {
              (localStorage.removeItem("token"),
                localStorage.removeItem("currentUser"),
                window.dispatchEvent(new Event("authChange")),
                (window.location.href = "/login-signup/login.html"));
            }));
        }
      } else (r && r.remove(), n && (n.style.display = ""));
    }
    (e(),
      window.addEventListener("storage", (t) => {
        ("token" !== t.key && "currentUser" !== t.key && null !== t.key) || e();
      }),
      window.addEventListener("authChange", e));
  }));
