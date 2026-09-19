/* Build the new public/i18n.js: engine + merged dictionaries + patterns + titles/metas */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const oldSrc = fs.readFileSync(path.join(ROOT, 'public', 'i18n.js'), 'utf8');

/* ---- extract DICT block verbatim from the old file ---- */
const dStart = oldSrc.indexOf('var DICT = {');
if (dStart < 0) throw new Error('DICT block not found');
const dEnd = oldSrc.indexOf('\n  };', dStart);
if (dEnd < 0) throw new Error('DICT closing not found');
const dictBlock = oldSrc.slice(dStart, dEnd + 5);

/* ---- extract old PHRASES object (supports original format and generated format) ---- */
const pStart = oldSrc.indexOf('var PHRASES =');
if (pStart < 0) throw new Error('PHRASES block not found');
let oldPhrases;
const origFormat = /var PHRASES = \{[\s\S]*?\n  \};/.test(oldSrc.slice(pStart, pStart + 400000)) && !/Universal phrase map/.test(oldSrc);
if (origFormat) {
  const pEnd = oldSrc.indexOf('\n  };', pStart);
  oldPhrases = new Function('return (' + oldSrc.slice(pStart + 'var PHRASES ='.length, pEnd + 3) + ')')();
} else {
  const a = oldSrc.indexOf('{', pStart);
  const b = oldSrc.indexOf('};', a);
  oldPhrases = JSON.parse(oldSrc.slice(a, b + 1));
}

/* ---- load new translation batches ---- */
const batches = ['tr-b1.js', 'tr-b2.js', 'tr-b3.js', 'tr-b4.js', 'tr-b5.js', 'tr-b6.js', 'tr-b7.js', 'tr-b8.js', 'tr-b9.js', 'tr-b10.js', 'tr-b11.js', 'tr-b12.js', 'tr-b13.js'].map(f => require(path.join(ROOT, 'i18n-work', f)));
const titles = require(path.join(ROOT, 'i18n-work', 'tr-titles.js'));
const patterns = [...require(path.join(ROOT, 'i18n-work', 'tr-patterns.js')), ...require(path.join(ROOT, 'i18n-work', 'tr-patterns2.js'))];
const reverseExtra = Object.assign({}, require(path.join(ROOT, 'i18n-work', 'tr-reverse.js')), require(path.join(ROOT, 'i18n-work', 'tr-reverse2.js')));

const norm = s => s.replace(/\s+/g, ' ').trim();
const EMPTY_OK = new Set(["مجال"]);
const JUNK = /[<>]|data-i18n=|style=|color:#|font-family|class=|\{|\}/;

const PHRASES = {};
const dropped = [];
function put(k, v, src) {
  const key = norm(k), val = norm(v).replace(/؟/g, '?');
  if (!key || key === val) { if (key === val && key) dropped.push([key, src, 'identity']); return; }
  if (!val && !EMPTY_OK.has(key)) { dropped.push([key, src, 'empty']); return; }
  if (JUNK.test(key)) { dropped.push([key, src, 'junk']); return; }
  PHRASES[key] = val;
}
for (const k in oldPhrases) if (Object.prototype.hasOwnProperty.call(oldPhrases, k)) put(k, oldPhrases[k], 'old');
batches.forEach((b, i) => { for (const k in b) if (Object.prototype.hasOwnProperty.call(b, k)) put(k, b[k], 'b' + (i + 1)); });
for (const ek of EMPTY_OK) PHRASES[ek] = '';

/* ---- coverage validation against extraction ---- */
const allNormalized = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n-work', 'all-arabic-normalized.json'), 'utf8'));
const todo = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n-work', 'todo-arabic.json'), 'utf8'));
const allSet = new Set(allNormalized.map(norm));
const oldKeys = new Set(Object.keys(oldPhrases).map(norm));

/* Alias fix: extraction keys that differ only by diacritics/char order get the
   translation of their diacritic-stripped twin already present in the dict. */
const stripDia = s => norm(s).replace(/[\u064B-\u0652\u0670\u0640]/g, '');
const diaMap = {};
for (const k in PHRASES) {
  const d = stripDia(k);
  if (!(d in diaMap)) diaMap[d] = PHRASES[k];
}
let aliases = 0;
for (const raw of todo) {
  const k = norm(raw);
  if (k in PHRASES) continue;
  const d = stripDia(k);
  if (d in diaMap) { PHRASES[k] = diaMap[d]; aliases++; }
}

const missing = todo.map(norm).filter(k => !(k in PHRASES));

const report = [];
report.push('PHRASES total: ' + Object.keys(PHRASES).length);
report.push('Diacritic aliases added: ' + aliases);
report.push('Dropped batch keys: ' + dropped.length);
dropped.forEach(([k, src, why]) => report.push('  DROPPED [' + why + '/' + src + ']: ' + k.slice(0, 90)));
report.push('TODO keys still untranslated: ' + missing.length);
missing.forEach(k => report.push('  MISSING: ' + k));
fs.writeFileSync(path.join(ROOT, 'i18n-work', 'coverage-report.txt'), report.join('\n'), 'utf8');
console.log('PHRASES:', Object.keys(PHRASES).length, '| dropped:', dropped.length, '| todo missing:', missing.length);

/* ---- engine template ---- */
const ENGINE = `/* ================================================================
   SHARIK I18N — Bilingual engine (AR ⇄ EN)
   1. data-i18n key dictionary
   2. Universal Arabic phrase translation (exact + decorated + patterns)
   3. Dynamic DOM mutation translation
   4. RTL/LTR switching, page titles & meta descriptions
   ================================================================ */
(function () {
  "use strict";

  %DICT%

  /* ═══ Universal phrase map (normalized Arabic -> English) ═══ */
  var PHRASES = %PHRASES%;

  /* ═══ Full-string patterns for dynamic (interpolated) strings ═══ */
  var PATTERNS = %PATTERNS%.map(function (p) {
    return [new RegExp("^(?:" + p[0] + ")$"), p[1]];
  });

  /* ═══ English page titles & meta descriptions by path ═══ */
  var TITLES_EN = %TITLES%;
  var METAS_EN = %METAS%;

  var REVERSE_PHRASES = {};
  for (var rk in PHRASES) {
    if (PHRASES.hasOwnProperty(rk) && !REVERSE_PHRASES.hasOwnProperty(PHRASES[rk])) {
      REVERSE_PHRASES[PHRASES[rk]] = rk;
    }
  }
  var REVERSE_EXTRA = %REVERSE_EXTRA%;
  for (var rxk in REVERSE_EXTRA) {
    if (REVERSE_EXTRA.hasOwnProperty(rxk) && !REVERSE_PHRASES.hasOwnProperty(rxk)) {
      REVERSE_PHRASES[rxk] = REVERSE_EXTRA[rxk];
    }
  }

  var current = "ar";
  try {
    var saved = localStorage.getItem("sharik_lang");
    if (saved === "en" || saved === "ar") current = saved;
    else if ((navigator.language || "").toLowerCase().indexOf("en") === 0) current = "en";
  } catch (e) {}

  var AR_RE = /[\\u0600-\\u06FF\\u0750-\\u077F]/;
  var HAS_LETTER = /[\\u0600-\\u06FFa-zA-Z]/;
  var IGNORE = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1, CANVAS: 1, NOSCRIPT: 1, TEMPLATE: 1, TEXTAREA: 1 };
  var TEXT_ATTRS = ["placeholder", "title", "aria-label", "alt", "value"];
  var PUNCT_MAP = { "\\u061F": "?", "\\u060C": ",", "\\u061B": ";", "\\u2026": "..." };

  function normWS(s) { return s.replace(/\\s+/g, " ").trim(); }

  var LEAD_RE = /^([^\\u0600-\\u06FFa-zA-Z0-9]+?)\\s*(?=[\\u0600-\\u06FFa-zA-Z0-9])/;
  var TRAIL_RE = /\\s+([^\\u0600-\\u06FFa-zA-Z0-9]+)$/;

  function lookupEn(str) {
    var t = normWS(str);
    if (!t || !AR_RE.test(t)) return null;
    if (PHRASES.hasOwnProperty(t)) return PHRASES[t];
    var lead = "", trail = "", core = t, m;
    m = core.match(LEAD_RE);
    if (m) { lead = m[1] + " "; core = core.slice(m[0].length); }
    m = core.match(TRAIL_RE);
    if (m) { trail = m[1]; core = core.slice(0, core.length - m[0].length); }
    if (core && PHRASES.hasOwnProperty(core)) {
      var tail = trail ? (PUNCT_MAP[trail] || trail) : "";
      return lead + PHRASES[core] + tail;
    }
    var candidates = core !== t ? [core, t] : [t];
    for (var c = 0; c < candidates.length; c++) {
      var s = candidates[c];
      for (var i = 0; i < PATTERNS.length; i++) {
        if (PATTERNS[i][0].test(s)) {
          var res = s.replace(PATTERNS[i][0], PATTERNS[i][1]);
          return c === 0 ? lead + res : res;
        }
      }
    }
    return null;
  }

  function translateToAr(str) {
    var t = normWS(str);
    if (!t) return null;
    return REVERSE_PHRASES.hasOwnProperty(t) ? REVERSE_PHRASES[t] : null;
  }

  function t(key) {
    if (!key) return "";
    var d = DICT[current] || DICT.ar;
    if (d && d[key]) return d[key];
    if (current === "en" && PHRASES.hasOwnProperty(normWS(key))) return PHRASES[normWS(key)];
    if (current === "ar" && REVERSE_PHRASES.hasOwnProperty(key)) return REVERSE_PHRASES[key];
    return (DICT.ar && DICT.ar[key]) || key;
  }

  function setNodeText(node, next) {
    if (node.nodeValue === next) return;
    if (!node.__origArabic && !node.__origEn) node.__origArabic = node.nodeValue;
    node.nodeValue = next;
  }

  function toWesternDigits(s) {
    return s
      .replace(/[\\u0660-\\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/\\u066C/g, ",")
      .replace(/\\u066B/g, ".");
  }

  var DIGITS_ONLY_RE = /^[\\u0660-\\u0669\\u066B\\u066C\\s,.\\-\\/%:]+$/;

  function translateTextNode(node, lang) {
    var val = node.nodeValue;
    if (!val) return;
    var trimmed = val.trim();
    if (!trimmed) return;
    if (lang === "en") {
      if (DIGITS_ONLY_RE.test(trimmed)) {
        var w = toWesternDigits(val);
        if (w !== val) setNodeText(node, w);
        return;
      }
      if (!HAS_LETTER.test(val)) return;
      if (trimmed.length < 2 && !PHRASES.hasOwnProperty(trimmed)) return;
      if (!AR_RE.test(trimmed)) return;
      var out = lookupEn(trimmed);
      if (out != null) {
        setNodeText(node, toWesternDigits(val.replace(trimmed, out)));
      }
    } else {
      if (node.__origArabic != null) { node.nodeValue = node.__origArabic; return; }
      if (!HAS_LETTER.test(val)) return;
      if (AR_RE.test(trimmed)) return;
      var ar = translateToAr(trimmed);
      if (ar != null) node.nodeValue = val.replace(trimmed, ar);
    }
  }

  function attrEligible(el, attr) {
    if (attr === "value") {
      if (el.tagName !== "INPUT") return false;
      var ty = (el.getAttribute("type") || "").toLowerCase();
      if (ty !== "submit" && ty !== "button" && ty !== "reset") return false;
      if (document.activeElement === el) return false;
    }
    return true;
  }

  function translateAttrs(el, lang) {
    for (var i = 0; i < TEXT_ATTRS.length; i++) {
      var attr = TEXT_ATTRS[i];
      var v = el.getAttribute && el.getAttribute(attr);
      if (!v || !v.trim() || !attrEligible(el, attr)) continue;
      if (lang === "en") {
        if (!AR_RE.test(v)) continue;
        var out = lookupEn(v);
        if (out != null) {
          if (!el.__origAttrs) el.__origAttrs = {};
          if (!(attr in el.__origAttrs)) el.__origAttrs[attr] = v;
          if (el.getAttribute(attr) !== out) el.setAttribute(attr, out);
        }
      } else {
        if (el.__origAttrs && el.__origAttrs[attr] != null) {
          if (el.getAttribute(attr) !== el.__origAttrs[attr]) el.setAttribute(attr, el.__origAttrs[attr]);
        } else {
          var ar = translateToAr(v);
          if (ar != null && el.getAttribute(attr) !== ar) el.setAttribute(attr, ar);
        }
      }
    }
  }

  function walk(node, lang) {
    if (!node) return;
    if (node.nodeType === 3) { translateTextNode(node, lang); return; }
    if (node.nodeType !== 1) return;
    translateAttrs(node, lang);
    if (IGNORE[node.tagName]) return;
    var child = node.firstChild;
    while (child) { walk(child, lang); child = child.nextSibling; }
  }

  function applyAttributes(root, lang) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      var trans = t(k);
      if (trans && trans !== k && el.innerHTML !== trans) el.innerHTML = trans;
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-placeholder");
      var trans = t(k);
      if (trans && trans !== k) el.setAttribute("placeholder", trans);
    });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-aria");
      var trans = t(k);
      if (trans && trans !== k) el.setAttribute("aria-label", trans);
    });
  }

  function pathKey() {
    var p = (window.location.pathname || "").toLowerCase();
    p = p.replace(/\\/+/, "/");
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return p;
  }

  function updateTitle(lang) {
    if (!document.title) return;
    var root = document.documentElement;
    if (!root.__origTitle) root.__origTitle = document.title;
    if (lang === "en") {
      var mapped = TITLES_EN[pathKey()];
      if (mapped) { document.title = mapped; return; }
      var tt = document.title
        .replace(/منصة شارك/g, "Sharik Platform")
        .replace(/منصة تبادل المهارات التقنية/g, "Tech Skill-Exchange Platform")
        .replace(/شارك/g, "Sharik");
      var out = lookupEn(tt);
      document.title = out != null ? out : tt;
    } else {
      document.title = root.__origTitle;
    }
  }

  function updateMeta(lang) {
    var m = document.querySelector('meta[name="description"]');
    if (!m) return;
    if (!m.__orig) m.__orig = m.getAttribute("content") || "";
    if (lang === "en") {
      var mapped = METAS_EN[pathKey()];
      if (mapped) { m.setAttribute("content", mapped); return; }
      var out = lookupEn(m.__orig);
      if (out != null) m.setAttribute("content", out);
    } else if (m.__orig) {
      m.setAttribute("content", m.__orig);
    }
  }

  var LTR_CSS = %LTR_CSS%;
  var RTL_FIX_CSS = %RTL_FIX_CSS%;

  function applyDir() {
    var isAr = current === "ar";
    if (document.documentElement) {
      document.documentElement.setAttribute("lang", isAr ? "ar" : "en");
      document.documentElement.setAttribute("dir", isAr ? "rtl" : "ltr");
      if (document.documentElement.classList) {
        document.documentElement.classList.toggle("lang-en", !isAr);
        document.documentElement.classList.toggle("lang-ar", isAr);
      }
    }
    var st = document.getElementById("sharikDirFix");
    if (!st) {
      st = document.createElement("style");
      st.id = "sharikDirFix";
      (document.head || document.documentElement).appendChild(st);
    }
    st.textContent = isAr ? RTL_FIX_CSS : LTR_CSS;
  }

  function updateLangButtons() {
    var btnText = current === "ar" ? "EN" : "ع";
    var btnTitle = current === "ar" ? "التبديل إلى الإنجليزية" : "Switch to Arabic";
    var buttons = document.querySelectorAll("#langBtn, #saasLangBtn, .lang-toggle-btn");
    buttons.forEach(function (btn) {
      btn.textContent = btnText;
      btn.setAttribute("title", btnTitle);
      btn.setAttribute("aria-label", btnTitle);
    });
  }

  var isApplying = false;

  function apply(root) {
    root = root || document.body || document.documentElement;
    isApplying = true;
    try {
      applyDir();
      applyAttributes(root, current);
      walk(root, current);
      updateTitle(current);
      updateMeta(current);
      updateLangButtons();
    } finally {
      isApplying = false;
    }
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "ar") return;
    current = lang;
    try { localStorage.setItem("sharik_lang", lang); } catch (e) {}
    apply(document.body);
    document.dispatchEvent(new CustomEvent("shariklangchange", { detail: { lang: lang } }));
  }

  window.SharikI18N = {
    t: t,
    apply: apply,
    setLang: setLang,
    getLang: function () { return current; },
    isRTL: function () { return current === "ar"; },
    translateText: function (str) { return current === "en" ? (lookupEn(str) || str) : str; },
    DICT: DICT,
    PHRASES: PHRASES
  };

  applyDir();
  document.dispatchEvent(new CustomEvent("shariki18nready"));

  function boot() {
    if (document.body) apply(document.body);
    setupObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* Safety net: late-rendered content (async fetches, timeouts) gets picked up
     even if the MutationObserver callback was starved by page scripts. */
  [500, 1500, 3000].forEach(function (ms) {
    setTimeout(function () {
      if (document.body) apply(document.body);
    }, ms);
  });

  function setupObserver() {
    if (!window.MutationObserver || window.__sharikI18nObserved) return;
    if (!document.body) { setTimeout(setupObserver, 50); return; }
    window.__sharikI18nObserved = true;
    var pending = [];
    var timer = null;
    var observer = new MutationObserver(function (muts) {
      if (isApplying) return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) pending.push(m.addedNodes[j]);
        } else if (m.type === "characterData" || m.type === "attributes") {
          pending.push(m.target);
        }
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        var list = pending;
        pending = [];
        for (var i = 0; i < list.length; i++) {
          var n = list[i];
          if (!n || !n.nodeType) continue;
          if (n.nodeType === 3) translateTextNode(n, current);
          else if (n.nodeType === 1) { translateAttrs(n, current); walk(n, current); }
        }
      }, 60);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt", "value"]
    });
  }
})();
`;

/* ---- scan CSS files: force-LTR overrides needed in EN mode ---- */
const taOverrides = new Set();
(function walkCss(d) {
  const abs = path.join(ROOT, 'public', d);
  for (const f of fs.readdirSync(abs)) {
    const rel = d ? d + '/' + f : f;
    const p = path.join(abs, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walkCss(rel);
    else if (f.endsWith('.css')) {
      const src = fs.readFileSync(p, 'utf8');
      const blocks = src.match(/[^{}]+\{[^{}]*\}/g) || [];
      for (const b of blocks) {
        const i = b.indexOf('{');
        const sel = b.slice(0, i).trim().replace(/\s+/g, ' ');
        const body = b.slice(i + 1);
        if (/text-align\s*:\s*right/i.test(body) && sel && !sel.includes('@')) {
          for (const part of sel.split(',')) {
            const clean = part.trim();
            if (clean) taOverrides.add(clean);
          }
        }
      }
    }
  }
})('');
const LTR_CSS = [
  'html.lang-en body, html.lang-en body * { direction: ltr !important; }',
  [...taOverrides].map(sel => 'html.lang-en ' + sel + ' { text-align: left !important; }').join('\n  ')
].join('\n  ');
const RTL_FIX_CSS = [
  'html.lang-ar .saas-nav a { padding-top: 9px; padding-bottom: 9px; }',
  'html.lang-ar .saas-sidebar { gap: 12px; padding-top: 14px; padding-bottom: 14px; }',
  'html.lang-ar .saas-brand { padding: 4px 8px; }'
].join('\n  ');
console.log('LTR override CSS: text-align rules:', taOverrides.size);

/* ---- lowercase path keys for titles/metas (pathKey() lowercases) ---- */
const lowerKeys = obj => { const o = {}; for (const k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) o[k.toLowerCase()] = obj[k]; return o; };
const TITLES_OUT = lowerKeys(titles.titles);
const METAS_OUT = lowerKeys(titles.metas);

const out = ENGINE
  .replace('%DICT%', () => dictBlock)
  .replace('%PHRASES%', () => JSON.stringify(PHRASES))
  .replace('%PATTERNS%', () => JSON.stringify(patterns))
  .replace('%TITLES%', () => JSON.stringify(TITLES_OUT))
  .replace('%METAS%', () => JSON.stringify(METAS_OUT))
  .replace('%REVERSE_EXTRA%', () => JSON.stringify(reverseExtra))
  .replace('%LTR_CSS%', () => JSON.stringify(LTR_CSS))
  .replace('%RTL_FIX_CSS%', () => JSON.stringify(RTL_FIX_CSS));

fs.writeFileSync(path.join(ROOT, 'public', 'i18n.js'), out, 'utf8');
console.log('Written public/i18n.js —', (out.length / 1024).toFixed(1) + ' KB');

/* PATTERNS note: we store sources; engine rebuilds RegExp with ^(?:...)$ at runtime? No — precompile below */
