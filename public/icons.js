!(function () {
  "use strict";
  var t = "http://www.w3.org/2000/svg",
    a = "data-svg-icon-ready",
    e = {
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
      moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
      arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      arrowUp: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
      close: '<path d="M18 6 6 18M6 6l12 12"/>',
      check: '<path d="m20 6-11 11-5-5"/>',
      alert:
        '<path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>',
      xCircle: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
      users:
        '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
      rocket:
        '<path d="M4.5 16.5c-1 1-1.5 3-1.5 4.5 1.5 0 3.5-.5 4.5-1.5"/><path d="M9 15 5 19"/><path d="M14.5 4.5C17 2 20 2 22 2c0 2 0 5-2.5 7.5L12 17l-5-5 7.5-7.5Z"/><path d="M15 9h.01"/><path d="M7 12H3l4-4M12 17v4l4-4"/>',
      fire: '<path d="M8.5 14.5a3.5 3.5 0 1 0 7 0c0-2.4-1.7-3.7-2.2-5.6-.9 1.2-1.5 1.7-2.9 2.5.3-2.8-.8-5-3.1-7C7.7 8 4 10.5 4 15a8 8 0 0 0 16 0c0-3.4-1.8-5.6-4-7"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      palette:
        '<circle cx="13.5" cy="6.5" r=".5" class="icon-fill"/><circle cx="17.5" cy="10.5" r=".5" class="icon-fill"/><circle cx="8.5" cy="7.5" r=".5" class="icon-fill"/><circle cx="6.5" cy="12.5" r=".5" class="icon-fill"/><path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h2a7 7 0 0 0 0-9h-2Z"/>',
      eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      target:
        '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" class="icon-fill"/>',
      brush:
        '<path d="m14 5 5 5"/><path d="M4 20c2 0 4-.5 5.5-2L20 7.5 16.5 4 6 14.5C4.5 16 4 18 4 20Z"/>',
      chart:
        '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-8"/>',
      pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
      mobile:
        '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
      server:
        '<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
      certificate:
        '<circle cx="12" cy="8" r="5"/><path d="m8.5 13-1 8 4.5-2 4.5 2-1-8"/>',
      store:
        '<path d="M4 10h16l-1.5-6h-13L4 10Z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/><path d="M4 10c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2"/>',
      lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
      shield:
        '<path d="M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/>',
      fileShield:
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 12 16 14v2.5c0 2-1.5 3.5-4 4.5-2.5-1-4-2.5-4-4.5V14l4-2Z"/>',
      star: '<path d="m12 2 2.9 6 6.6.9-4.8 4.7 1.1 6.6L12 17.1l-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9L12 2Z"/>',
      graduation:
        '<path d="m22 10-10-5-10 5 10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/>',
      database:
        '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v10c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 10c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
      bolt: '<path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z"/>',
      trend: '<path d="m3 17 6-6 4 4 7-8"/><path d="M14 7h6v6"/>',
      infinity:
        '<path d="M18.2 8.4c2 0 3.8 1.6 3.8 3.6s-1.8 3.6-3.8 3.6c-3.8 0-5.2-7.2-8.4-7.2C7.8 8.4 6 10 6 12s1.8 3.6 3.8 3.6c3.8 0 5.2-7.2 8.4-7.2Z"/>',
      cloud:
        '<path d="M17.5 18H7a4 4 0 1 1 .7-7.94A5.5 5.5 0 0 1 18.3 11 3.5 3.5 0 0 1 17.5 18Z"/>',
      brain:
        '<path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.2A3.5 3.5 0 0 0 8 18.9V21"/><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5.2 3.5 3.5 0 0 1-4 6.7V21"/><path d="M9 3c1.5 0 3 1 3 3v15M15 3c-1.5 0-3 1-3 3"/>',
      chat: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.5-4A8 8 0 1 1 21 12Z"/>',
      code: '<path d="m8 18-6-6 6-6"/><path d="m16 6 6 6-6 6"/><path d="m14 4-4 16"/>',
      globe:
        '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
      bot: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V3"/><path d="M8 12h.01M16 12h.01"/><path d="M9 16h6"/>',
      settings:
        '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1 1.64V21a2 2 0 1 1-4 0v-.09a1.8 1.8 0 0 0-1-1.64 1.8 1.8 0 0 0-2 .36l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.64-1H3a2 2 0 1 1 0-4h.09a1.8 1.8 0 0 0 1.64-1 1.8 1.8 0 0 0-.36-2l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05a1.8 1.8 0 0 0 2 .36H9.2A1.8 1.8 0 0 0 10 2.91V3a2 2 0 1 1 4 0v-.09a1.8 1.8 0 0 0 1 1.64 1.8 1.8 0 0 0 2-.36l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05a1.8 1.8 0 0 0-.36 2V9.2A1.8 1.8 0 0 0 21.09 10H21a2 2 0 1 1 0 4h-.09a1.8 1.8 0 0 0-1.51 1Z"/>',
      document:
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/>',
      calendar:
        '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      phone:
        '<path d="M6 3h3l1.5 4-2 1.5a12 12 0 0 0 7 7l1.5-2 4 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
      printer:
        '<path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="7" rx="1"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M8 17h8"/>',
      home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/>',
      trophy:
        '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"/>',
      lightbulb:
        '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 10a4 4 0 1 1 8 0c0 2-1 3-2 4-.6.6-1 1.2-1 2h-2c0-.8-.4-1.4-1-2-1-1-2-2-2-4Z"/>',
      handshake:
        '<path d="M8 12 5.5 9.5a3 3 0 0 1 4.2-4.2L12 7.6l2.3-2.3a3 3 0 0 1 4.2 4.2L16 12"/><path d="m8 12 4 4 4-4"/><path d="m10 14-2 2M14 14l2 2"/>',
      book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
      cap: '<path d="m22 10-10-5-10 5 10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
      draw: '<path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
      pin: '<path d="M12 17v5"/><path d="M8 3h8l-1 7 3 3H6l3-3-1-7Z"/>',
      map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
      motion:
        '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 9l6 3-6 3V9Z"/>',
      scale:
        '<path d="M12 3v18M5 7h14"/><path d="m6 7-3 6h6L6 7ZM18 7l-3 6h6l-3-6Z"/>',
      building:
        '<path d="M4 21h16"/><path d="M6 21V7l6-4 6 4v14"/><path d="M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01"/>',
      briefcase:
        '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M12 12v2"/>',
      money:
        '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/>',
      flask:
        '<path d="M9 3h6"/><path d="M10 3v5l-5.5 9.5A2.3 2.3 0 0 0 6.5 21h11a2.3 2.3 0 0 0 2-3.5L14 8V3"/><path d="M7 16h10"/>',
      key: '<circle cx="7.5" cy="14.5" r="4.5"/><path d="M11 11 21 1"/><path d="m16 6 2 2"/><path d="m14 8 2 2"/>',
      clipboard:
        '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="M9 9h6M9 13h6M9 17h4"/>',
      package:
        '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/><path d="m7.5 5.5 9 5"/>',
      wifi: '<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M12 20h.01"/>',
      refresh:
        '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.5 5.8L21 8"/><path d="M21 3v5h-5"/>',
      shuffle:
        '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
      ruler:
        '<path d="m4 17 13-13 3 3L7 20 4 17Z"/><path d="m12 6 2 2M9 9l2 2M6 12l2 2"/>',
      accessibility:
        '<circle cx="12" cy="4" r="2"/><path d="M4 10h16"/><path d="M12 6v15"/><path d="m8 21 4-8 4 8"/>',
      leaf: '<path d="M5 20c8-2 13-8 14-17-8 1-14 6-16 14 0 2 1 3 2 3Z"/><path d="M5 20c3-5 7-8 12-11"/>',
      link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.08-7.08l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.08 7.08l1.71-1.71"/>',
    },
    h = {
      "fa-bars": "menu",
      "fa-fire": "fire",
      "fa-users": "users",
      "fa-clock": "clock",
      "fa-rocket": "rocket",
      "fa-palette": "palette",
      "fa-eye": "eye",
      "fa-server": "server",
      "fa-certificate": "certificate",
      "fa-mobile": "mobile",
      "fa-store": "store",
      "fa-lock": "lock",
      "fa-file-shield": "fileShield",
      "fa-shield": "shield",
      "fa-star": "star",
      "fa-graduation-cap": "graduation",
      "fa-layer-group": "database",
      "fa-bolt": "bolt",
      "fa-trending-up": "trend",
      "fa-infinity": "infinity",
      "fa-edit": "pen",
      "fa-home": "home",
      "fa-envelope": "mail",
      "fa-phone": "phone",
      "fa-print": "printer",
    },
    r = {
      "☀️": "sun",
      "☀": "sun",
      "🌙": "moon",
      "☾": "moon",
      "☰": "menu",
      "↑": "arrowUp",
      "←": "arrowLeft",
      "→": "arrowRight",
      "✓": "check",
      "✅": "check",
      "✕": "close",
      "❌": "xCircle",
      "⚠️": "alert",
      "🔥": "fire",
      "🚀": "rocket",
      "⭐": "star",
      "🌟": "star",
      "💬": "chat",
      "📚": "book",
      "🎓": "cap",
      "📊": "chart",
      "📈": "trend",
      "🎯": "target",
      "👤": "user",
      "🔍": "search",
      "⚙️": "settings",
      "📝": "document",
      "💡": "lightbulb",
      "🧠": "brain",
      "💻": "code",
      "📱": "mobile",
      "🔒": "lock",
      "☁️": "cloud",
      "🗄️": "database",
      "🌐": "globe",
      "🤖": "bot",
      "🛡️": "shield",
      "🖌️": "brush",
      "✍️": "pen",
      "👁️": "eye",
      "🏆": "trophy",
      "🤝": "handshake",
      "🌍": "globe",
      "📅": "calendar",
      "✉️": "mail",
      "😕": "alert",
      "🎉": "star",
      "✏️": "draw",
      "🗺️": "map",
      "🎞️": "motion",
      "⚛️": "code",
      "🕵️": "search",
      "⚖️": "scale",
      "🏛️": "building",
      "📌": "pin",
      "🔮": "star",
      "🧪": "flask",
      "🐍": "code",
      "📉": "chart",
      "🎲": "target",
      "🤗": "users",
      "🏢": "building",
      "📜": "certificate",
      "💹": "trend",
      "🔧": "settings",
      "🐳": "package",
      "💾": "database",
      "💰": "money",
      "🔴": "alert",
      "🐧": "server",
      "🐛": "search",
      "📋": "clipboard",
      "🔑": "key",
      "⚡": "bolt",
      "🔐": "lock",
      "🐘": "database",
      "🐬": "database",
      "🍃": "leaf",
      "🔗": "link",
      "🔄": "refresh",
      "🐙": "code",
      "🏦": "building",
      "📲": "mobile",
      "💸": "money",
      "🍎": "mobile",
      "📦": "package",
      "🏪": "store",
      "📡": "wifi",
      "🔀": "shuffle",
      "📶": "wifi",
      "🌉": "globe",
      "💼": "briefcase",
      "🎨": "palette",
      "📐": "ruler",
      "🔬": "search",
      "🎭": "user",
      "♿": "accessibility",
      "🧱": "package",
      "🟢": "code",
    },
    c = Object.keys(r).sort(function (t, a) {
      return a.length - t.length;
    }),
    d = new RegExp(
      "(" +
        c
          .map(function (t) {
            return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          })
          .join("|") +
        ")",
      "gu",
    );
  function i(t) {
    return e[t] ? t : "link";
  }
  function l(a, h) {
    var r = document.createElement("span"),
      c = i(a),
      d = document.createElementNS(t, "svg");
    return (
      (r.className = "svg-icon svg-icon-" + c),
      r.setAttribute("data-icon", c),
      r.setAttribute("aria-hidden", h ? "false" : "true"),
      h && r.setAttribute("aria-label", h),
      d.setAttribute("viewBox", "0 0 24 24"),
      d.setAttribute("aria-hidden", "true"),
      d.setAttribute("focusable", "false"),
      (d.innerHTML = e[c]),
      r.appendChild(d),
      r
    );
  }
  function p(t) {
    t.querySelectorAll("i[class*='fa']").forEach(function (t) {
      t.hasAttribute(a) ||
        (t.setAttribute(a, "true"),
        t.replaceWith(
          l(
            (function (t) {
              for (
                var a = String(t || "").split(/\s+/), e = 0;
                e < a.length;
                e += 1
              )
                if (h[a[e]]) return h[a[e]];
              return "link";
            })(t.className),
          ),
        ));
    });
  }
  function n(t) {
    var a = t.parentElement;
    return a && t.nodeValue && d.test(t.nodeValue)
      ? ((d.lastIndex = 0),
        !!a.closest("script,style,title,textarea,code,pre,.svg-icon"))
      : ((d.lastIndex = 0), !0);
  }
  function o(h) {
    h &&
      1 === h.nodeType &&
      ((function (h) {
        h.querySelectorAll(".svg-icon[data-icon]").forEach(function (h) {
          if (!h.firstElementChild && !h.hasAttribute(a)) {
            var r = i(h.getAttribute("data-icon")),
              c = document.createElementNS(t, "svg");
            (h.setAttribute(a, "true"),
              h.setAttribute(
                "aria-hidden",
                h.getAttribute("aria-label") ? "false" : "true",
              ),
              c.setAttribute("viewBox", "0 0 24 24"),
              c.setAttribute("aria-hidden", "true"),
              c.setAttribute("focusable", "false"),
              (c.innerHTML = e[r]),
              h.classList.add("svg-icon-" + r),
              h.appendChild(c));
          }
        });
      })(h),
      p(h),
      (function (t) {
        for (
          var a, e = document.createTreeWalker(t, NodeFilter.SHOW_TEXT), h = [];
          (a = e.nextNode());
        )
          n(a) || h.push(a);
        h.forEach(function (t) {
          var a = t.nodeValue,
            e = document.createDocumentFragment(),
            h = 0;
          (a.replace(d, function (t, c, d) {
            return (
              d > h && e.appendChild(document.createTextNode(a.slice(h, d))),
              e.appendChild(l(r[c])),
              (h = d + c.length),
              t
            );
          }),
            h < a.length && e.appendChild(document.createTextNode(a.slice(h))),
            t.replaceWith(e));
        });
      })(h),
      (function (t) {
        t.querySelectorAll("svg").forEach(function (t) {
          t.closest(".svg-icon") ||
            (t.getAttribute("focusable") ||
              t.setAttribute("focusable", "false"),
            t.getAttribute("aria-hidden") ||
              t.getAttribute("role") ||
              t.setAttribute("aria-hidden", "true"));
        });
      })(h));
  }
  function s() {
    var t;
    (o(document.body),
      (t = !1),
      new MutationObserver(function () {
        t ||
          ((t = !0),
          window.requestAnimationFrame(function () {
            ((t = !1), o(document.body));
          }));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        characterData: !0,
      }));
  }
  ((window.SharikIcons = {
    create: l,
    refresh: function (t) {
      o(t || document.body);
    },
  }),
    "loading" === document.readyState
      ? document.addEventListener("DOMContentLoaded", s)
      : s());
})();
