/* ================================================================
   SHARIK TOAST — بديل موحد وأنيق لنوافذ alert القديمة
   يستبدل window.alert بإشعارات بهوية شارك (زجاجية داكنة/بنفسجية)
   ================================================================ */
(function () {
  "use strict";

  var CSS = [
    '.sharik-toast-stack{position:fixed;bottom:24px;right:24px;z-index:2147483000;display:flex;flex-direction:column;gap:10px;max-width:min(360px,calc(100vw - 32px));pointer-events:none}',
    '.sharik-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:12px;direction:rtl;text-align:right;',
      'padding:14px 14px 16px;border-radius:16px;position:relative;overflow:hidden;max-width:100%;',
      'background:rgba(18,12,30,.92);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);',
      'border:1px solid rgba(181,123,238,.35);box-shadow:0 14px 44px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.03) inset;',
      'font-family:"Tajawal","Segoe UI",system-ui,sans-serif;color:#f8fafc;',
      'animation:sharikToastIn .38s cubic-bezier(.16,1,.3,1) both}',
    '.sharik-toast.leaving{animation:sharikToastOut .28s ease forwards}',
    '.sharik-toast .sharik-toast-icon{flex-shrink:0;width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-top:1px}',
    '.sharik-toast .sharik-toast-icon svg{width:19px;height:19px}',
    '.sharik-toast .sharik-toast-msg{flex:1;font-size:14px;font-weight:600;line-height:1.65;white-space:pre-line;word-break:break-word;padding-top:6px}',
    '.sharik-toast .sharik-toast-close{flex-shrink:0;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:15px;line-height:1;padding:6px 2px;margin-top:2px;font-family:inherit;transition:color .2s}',
    '.sharik-toast .sharik-toast-close:hover{color:#f8fafc}',
    '.sharik-toast .sharik-toast-bar{position:absolute;bottom:0;right:0;height:3px;width:100%;transform-origin:right;animation:sharikToastBar linear forwards}',
    '.sharik-toast:hover .sharik-toast-bar{animation-play-state:paused}',
    /* أنواع الإشعارات — بنفس ألوان هوية الموقع */
    '.sharik-toast.error{border-color:rgba(255,79,106,.45)}',
    '.sharik-toast.error .sharik-toast-icon{background:linear-gradient(135deg,#ff4f6a,#dc2626);box-shadow:0 4px 14px rgba(255,79,106,.35)}',
    '.sharik-toast.error .sharik-toast-bar{background:linear-gradient(270deg,#ff4f6a,#dc2626)}',
    '.sharik-toast.success{border-color:rgba(79,255,176,.4)}',
    '.sharik-toast.success .sharik-toast-icon{background:linear-gradient(135deg,#4fffb0,#10b981);box-shadow:0 4px 14px rgba(79,255,176,.3)}',
    '.sharik-toast.success .sharik-toast-bar{background:linear-gradient(270deg,#4fffb0,#10b981)}',
    '.sharik-toast.warning{border-color:rgba(245,158,11,.45)}',
    '.sharik-toast.warning .sharik-toast-icon{background:linear-gradient(135deg,#fbbf24,#f59e0b);box-shadow:0 4px 14px rgba(245,158,11,.3)}',
    '.sharik-toast.warning .sharik-toast-bar{background:linear-gradient(270deg,#fbbf24,#f59e0b)}',
    '.sharik-toast.info{border-color:rgba(181,123,238,.5)}',
    '.sharik-toast.info .sharik-toast-icon{background:linear-gradient(135deg,#b57bee,#8b5cf6);box-shadow:0 4px 14px rgba(181,123,238,.4)}',
    '.sharik-toast.info .sharik-toast-bar{background:linear-gradient(270deg,#b57bee,#8b5cf6)}',
    /* الوضع الفاتح */
    'body.light .sharik-toast{background:rgba(255,255,255,.94);color:#0f172a;box-shadow:0 14px 44px rgba(15,23,42,.18)}',
    'body.light .sharik-toast .sharik-toast-close{color:#64748b}',
    'body.light .sharik-toast .sharik-toast-close:hover{color:#0f172a}',
    '@keyframes sharikToastIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}',
    '@keyframes sharikToastOut{to{opacity:0;transform:translateY(10px) scale(.96)}}',
    '@keyframes sharikToastBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}',
    '@media (max-width:480px){.sharik-toast-stack{bottom:16px;right:16px}}'
  ].join('');

  /* حقن التنسيقات مرة واحدة */
  (function injectCss() {
    if (document.querySelector('style[data-sharik-toast]')) return;
    var el = document.createElement('style');
    el.setAttribute('data-sharik-toast', '');
    el.textContent = CSS;
    (document.head || document.documentElement).appendChild(el);
  })();

  var ICONS = {
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9.2"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11v5M12 7.5v.5"/><circle cx="12" cy="12" r="9.2"/></svg>'
  };

  var ERROR_RE = /خط[أا]|فشل|تعذر|تعذّر|غير صحيح|غير صالح|غير متصل|غير مصرح|مطلوب|أدخل|اكتب |سجّل الدخول|سجل الدخول|يجب|انتبه|محظور|غير مسموح|خاطئ/;
  var SUCCESS_RE = /نجاح|بنجاح|مبروك|مبارك|تهانيا|أهلا|اهلا|مرحبا|تمت|تم |تم‌|✓|🎉|🖤|👏/;

  function typeFor(msg) {
    if (SUCCESS_RE.test(msg)) return 'success';
    if (ERROR_RE.test(msg)) return 'error';
    return 'info';
  }

  var stack = null;
  var DURATION = 4500;

  function ensureStack() {
    if (stack && document.contains(stack)) return stack;
    stack = document.createElement('div');
    stack.className = 'sharik-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    (document.body || document.documentElement).appendChild(stack);
    return stack;
  }

  function show(msg, type, duration) {
    if (typeof msg !== 'string') msg = String(msg == null ? '' : msg);
    if (!/^(error|success|warning|info)$/.test(type || '')) type = typeFor(msg);
    var ms = typeof duration === 'number' ? duration : DURATION;

    var card = document.createElement('div');
    card.className = 'sharik-toast ' + type;
    card.setAttribute('role', 'status');

    var icon = document.createElement('div');
    icon.className = 'sharik-toast-icon';
    icon.innerHTML = ICONS[type] || ICONS.info;

    var text = document.createElement('div');
    text.className = 'sharik-toast-msg';
    text.textContent = msg;

    var close = document.createElement('button');
    close.className = 'sharik-toast-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'إغلاق');
    close.textContent = '✕';

    var bar = document.createElement('div');
    bar.className = 'sharik-toast-bar';
    bar.style.animationDuration = ms + 'ms';

    card.appendChild(icon);
    card.appendChild(text);
    card.appendChild(close);
    card.appendChild(bar);

    var gone = false;
    function dismiss() {
      if (gone) return;
      gone = true;
      clearTimeout(timer);
      card.classList.add('leaving');
      /* إزالة فورية عند انتهاء الأنيميشن مع مؤقت احتياطي (للتبويبات الخلفية) */
      card.addEventListener('animationend', function (ev) {
        if (ev.animationName === 'sharikToastOut') card.remove();
      }, { once: true });
      setTimeout(function () { card.remove(); }, 300);
    }

    close.addEventListener('click', dismiss);
    var timer = setTimeout(dismiss, ms);

    var st = ensureStack();
    st.appendChild(card);
    /* لا تتراكم أكثر من 4 إشعارات */
    var cards = st.querySelectorAll('.sharik-toast:not(.leaving)');
    if (cards.length > 4) cards[0].classList.add('leaving'), setTimeout(function (c) { return function () { c.remove(); }; }(cards[0]), 300);
    return card;
  }

  /* استبدال alert القديم بكل الصفحات */
  var nativeAlert = window.alert;
  window.alert = function (m) {
    try { show(m); } catch (e) { nativeAlert(m); }
  };

  /* متاح للاستخدام المباشر في الكود الجديد: SharikToast.show('نص', 'success') */
  window.SharikToast = { show: show };

  /* ================================================================
     SHARIK CONFIRM — مودال تأكيد أنيق بديل نوافذ confirm() القديمة
     الاستخدام: SharikConfirm.show('الرسالة', { type, confirmText, cancelText, title })
     يرجع Promise<boolean> — لا يستبدل window.confirm تلقائيًا حفاظًا على
     الكود المتزامن الموجود؛ المواضع تحوَّل صراحةً إلى await.
     ================================================================ */
  var CF_CSS = [
    '.sharik-cf-overlay{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:20px;',
      'background:rgba(6,4,12,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:sharikCfFade .2s ease both}',
    '.sharik-cf-overlay.sharik-cf-out{animation:sharikCfFadeOut .18s ease forwards}',
    '.sharik-cf{width:min(400px,100%);background:rgba(18,12,30,.97);border:1px solid rgba(181,123,238,.4);border-radius:20px;padding:26px 24px 22px;',
      'text-align:center;direction:rtl;font-family:"Tajawal","Segoe UI",system-ui,sans-serif;color:#f8fafc;',
      'box-shadow:0 24px 80px rgba(0,0,0,.6);animation:sharikCfPop .28s cubic-bezier(.16,1,.3,1) both}',
    '.sharik-cf-icon{width:56px;height:56px;border-radius:18px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center}',
    '.sharik-cf-icon svg{width:26px;height:26px}',
    '.sharik-cf-title{font-size:17px;font-weight:800;margin-bottom:8px}',
    '.sharik-cf-msg{font-size:14px;line-height:1.75;color:#cbd5e1;white-space:pre-line;word-break:break-word}',
    '.sharik-cf-btns{display:flex;gap:10px;margin-top:22px}',
    '.sharik-cf-btn{flex:1;height:44px;border-radius:13px;border:none;cursor:pointer;font-family:inherit;font-size:14.5px;font-weight:700;transition:transform .15s,box-shadow .2s,background .2s,color .2s}',
    '.sharik-cf-btn:active{transform:scale(.97)}',
    '.sharik-cf-ok{color:#fff}',
    '.sharik-cf-ok.danger{background:linear-gradient(135deg,#ff4f6a,#dc2626);box-shadow:0 6px 18px rgba(255,79,106,.35)}',
    '.sharik-cf-ok.warning{background:linear-gradient(135deg,#fbbf24,#d97706);box-shadow:0 6px 18px rgba(245,158,11,.3)}',
    '.sharik-cf-ok.info{background:linear-gradient(135deg,#b57bee,#8b5cf6);box-shadow:0 6px 18px rgba(181,123,238,.4)}',
    '.sharik-cf-ok:hover{filter:brightness(1.08)}',
    '.sharik-cf-cancel{background:transparent;border:1px solid rgba(255,255,255,.16);color:#94a3b8}',
    '.sharik-cf-cancel:hover{background:rgba(255,255,255,.06);color:#f8fafc}',
    '.sharik-cf.danger .sharik-cf-icon{background:linear-gradient(135deg,#ff4f6a,#dc2626);box-shadow:0 8px 24px rgba(255,79,106,.35)}',
    '.sharik-cf.warning .sharik-cf-icon{background:linear-gradient(135deg,#fbbf24,#f59e0b);box-shadow:0 8px 24px rgba(245,158,11,.3)}',
    '.sharik-cf.info .sharik-cf-icon{background:linear-gradient(135deg,#b57bee,#8b5cf6);box-shadow:0 8px 24px rgba(181,123,238,.4)}',
    'body.light .sharik-cf{background:rgba(255,255,255,.97);color:#0f172a}',
    'body.light .sharik-cf-msg{color:#475569}',
    'body.light .sharik-cf-cancel{border-color:rgba(15,23,42,.15);color:#64748b}',
    'body.light .sharik-cf-cancel:hover{background:rgba(15,23,42,.05);color:#0f172a}',
    '@keyframes sharikCfFade{from{opacity:0}to{opacity:1}}',
    '@keyframes sharikCfFadeOut{to{opacity:0}}',
    '@keyframes sharikCfPop{from{opacity:0;transform:scale(.9) translateY(14px)}to{opacity:1;transform:none}}'
  ].join('');

  (function injectConfirmCss() {
    if (document.querySelector('style[data-sharik-cf]')) return;
    var el = document.createElement('style');
    el.setAttribute('data-sharik-cf', '');
    el.textContent = CF_CSS;
    (document.head || document.documentElement).appendChild(el);
  })();

  var CF_ICONS = {
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L2.5 20h19L12 3z"/><path d="M12 10v4M12 17v.5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.7 2.3c-.8.5-1.3 1-1.3 1.9M12 16.7v.4"/></svg>'
  };
  var CF_TITLES = { danger: 'تأكيد الحذف', warning: 'تأكيد المطلوب', info: 'تأكيد' };
  var CF_DANGER_RE = /حذف|احذف|مسح|نهائي|نهائيا|إزالة|ازالة/;
  var CF_WARN_RE = /خروج|إلغاء|الغاء|إلغاء/;

  function confirmTypeFor(msg) {
    if (CF_DANGER_RE.test(msg)) return 'danger';
    if (CF_WARN_RE.test(msg)) return 'warning';
    return 'info';
  }

  function showConfirm(msgOrOpts, opts) {
    var o = {};
    if (typeof msgOrOpts === 'string') { o.message = msgOrOpts; if (opts) for (var k in opts) o[k] = opts[k]; }
    else if (msgOrOpts && typeof msgOrOpts === 'object') { o = msgOrOpts; }
    var message = o.message || o.msg || '';
    var type = /^(danger|warning|info)$/.test(o.type || '') ? o.type : confirmTypeFor(message);
    var title = o.title || CF_TITLES[type];
    var okText = o.confirmText || (type === 'danger' ? 'حذف' : 'تأكيد');
    var cancelText = o.cancelText || 'إلغاء';

    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'sharik-cf-overlay';
      overlay.innerHTML =
        '<div class="sharik-cf ' + type + '" role="alertdialog" aria-modal="true" dir="rtl">'
        + '<div class="sharik-cf-icon">' + (CF_ICONS[type] || CF_ICONS.info) + '</div>'
        + '<div class="sharik-cf-title"></div>'
        + '<div class="sharik-cf-msg"></div>'
        + '<div class="sharik-cf-btns">'
        + '<button type="button" class="sharik-cf-btn sharik-cf-cancel"></button>'
        + '<button type="button" class="sharik-cf-btn sharik-cf-ok ' + type + '"></button>'
        + '</div></div>';

      overlay.querySelector('.sharik-cf-title').textContent = title;
      overlay.querySelector('.sharik-cf-msg').textContent = message;
      overlay.querySelector('.sharik-cf-cancel').textContent = cancelText;
      var okBtn = overlay.querySelector('.sharik-cf-ok');
      okBtn.textContent = okText;

      var done = false;
      function finish(v) {
        if (done) return;
        done = true;
        document.removeEventListener('keydown', onKey, true);
        overlay.classList.add('sharik-cf-out');
        /* إزالة فورية عند انتهاء الأنيميشن مع مؤقت احتياطي (للتبويبات الخلفية) */
        overlay.addEventListener('animationend', function (ev) {
          if (ev.animationName === 'sharikCfFadeOut') overlay.remove();
        }, { once: true });
        setTimeout(function () { overlay.remove(); }, 200);
        resolve(v);
      }
      function onKey(ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
        else if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
      }

      overlay.addEventListener('click', function (ev) { if (ev.target === overlay) finish(false); });
      overlay.querySelector('.sharik-cf-cancel').addEventListener('click', function () { finish(false); });
      okBtn.addEventListener('click', function () { finish(true); });
      document.addEventListener('keydown', onKey, true);

      (document.body || document.documentElement).appendChild(overlay);
      setTimeout(function () { try { okBtn.focus(); } catch (e) {} }, 60);
    });
  }

  window.SharikConfirm = { show: showConfirm };

  function boot() {
    ensureStack();
    /* تتبع الزيارات — بيج: مسار الصفحة + المستخدم إن كان مسجلاً */
    try {
      var base = (window.SHARIK_CONFIG && window.SHARIK_CONFIG.API_BASE) || "";
      var tk = null;
      try { tk = localStorage.getItem("token"); } catch (e) {}
      var headers = { "Content-Type": "application/json" };
      if (tk) headers.Authorization = "Bearer " + tk;
      fetch(base + "/api/track", {
        method: "POST",
        keepalive: true,
        headers: headers,
        body: JSON.stringify({ p: location.pathname, r: document.referrer || "" })
      }).catch(function () {});
    } catch (e) {}
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
