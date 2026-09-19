// Sharik — Skills Selection (Learn vs Teach)
// Same behavior as before, with: saved skills restored on load (server-synced),
// DOM-safe tag rendering (no string-built onclick), bilingual messages.
const availableSkills = ["JavaScript","Python","React","Node.js","HTML/CSS","Photoshop","Illustrator","UI/UX Design","Figma","التسويق الرقمي","SEO","إدارة المحتوى","التصوير","المونتاج","كتابة المحتوى","Excel","إدارة المشاريع","الترجمة","اللغة الإنجليزية","اللغة الفرنسية"];

let selectedLearnSkills = [], selectedTeachSkills = [], verifiedSkills = [];

function getToken() {
  return localStorage.getItem("token");
}

function isEn() {
  return window.SharikI18N && window.SharikI18N.getLang && window.SharikI18N.getLang() === "en";
}

function T(ar, en) {
  return isEn() ? en : ar;
}

function escapeHtml(v) {
  return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function buildSkillGrids() {
  const learnGrid = document.getElementById("learnSkillsGrid"), teachGrid = document.getElementById("teachSkillsGrid");
  learnGrid.innerHTML = "", teachGrid.innerHTML = "";
  availableSkills.forEach(function (skill) {
    const isVerified = verifiedSkills.includes(skill);
    const label = isVerified ? skill + " ✓" : skill;

    const learnItem = document.createElement("div");
    learnItem.className = "skill-item" + (isVerified ? " verified-skill" : "");
    learnItem.textContent = label;
    learnItem.dataset.skill = skill;
    if (selectedLearnSkills.includes(skill)) learnItem.classList.add("selected");
    learnItem.addEventListener("click", function () { toggleSkill(skill, "learn", learnItem); });
    learnGrid.appendChild(learnItem);

    const teachItem = document.createElement("div");
    teachItem.className = "skill-item" + (isVerified ? " verified-skill" : "");
    teachItem.textContent = label;
    teachItem.dataset.skill = skill;
    if (selectedTeachSkills.includes(skill)) teachItem.classList.add("selected");
    teachItem.addEventListener("click", function () { toggleSkill(skill, "teach", teachItem); });
    teachGrid.appendChild(teachItem);
  });
}

function showVerifiedSection() {
  if (verifiedSkills.length === 0) return;
  const section = document.getElementById("verifiedSection"), list = document.getElementById("verifiedList");
  if (section && list) {
    section.style.display = "block";
    list.innerHTML = verifiedSkills.map(function (s) { return '<span class="verified-badge">✓ ' + escapeHtml(s) + "</span>"; }).join(" ");
  }
}

function toggleSkill(skill, type, el) {
  const list = type === "learn" ? selectedLearnSkills : selectedTeachSkills;
  const idx = list.indexOf(skill);
  if (idx > -1) { list.splice(idx, 1); el.classList.remove("selected"); }
  else { list.push(skill); el.classList.add("selected"); }
  renderSelected(type);
}

function addCustomSkill(type) {
  const inputId = type === "learn" ? "customLearnSkill" : "customTeachSkill";
  const input = document.getElementById(inputId);
  const value = input.value.trim().slice(0, 60);
  if (!value) return showMsg("error", T("اكتب اسم المهارة أولاً", "Type the skill name first"));
  const list = type === "learn" ? selectedLearnSkills : selectedTeachSkills;
  if (list.includes(value) || availableSkills.includes(value)) return showMsg("error", T("المهارة موجودة بالفعل", "Skill already added"));
  list.push(value);
  input.value = "";
  renderSelected(type);
}

function renderSelected(type) {
  const list = type === "learn" ? selectedLearnSkills : selectedTeachSkills;
  const container = document.getElementById(type + "Selected");
  if (!container) return;
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = '<span style="color:var(--muted);font-size:13px">' + T("اختر على الأقل مهارة واحدة", "Pick at least one skill") + "</span>";
    return;
  }
  list.forEach(function (skill) {
    const tag = document.createElement("div");
    tag.className = "selected-tag";
    tag.appendChild(document.createTextNode(skill + (verifiedSkills.includes(skill) ? " ✓" : "") + " "));
    const remove = document.createElement("span");
    remove.textContent = "✕";
    remove.style.cursor = "pointer";
    remove.style.color = "var(--danger)";
    remove.addEventListener("click", function () { removeSkill(skill, type); });
    tag.appendChild(remove);
    container.appendChild(tag);
  });
}

function removeSkill(skill, type) {
  const list = type === "learn" ? selectedLearnSkills : selectedTeachSkills;
  const idx = list.indexOf(skill);
  if (idx > -1) list.splice(idx, 1);
  document.getElementById(type === "learn" ? "learnSkillsGrid" : "teachSkillsGrid").querySelectorAll(".skill-item").forEach(function (el) {
    if (el.dataset.skill === skill) el.classList.remove("selected");
  });
  renderSelected(type);
}

function submitSkills() {
  if (selectedLearnSkills.length === 0 || selectedTeachSkills.length === 0) {
    return showMsg("error", T("⚠️ لازم تختار مهارة واحدة على الأقل من كل قسم", "⚠️ Pick at least one skill in each section (Learn and Teach)"));
  }
  saveAndRedirect();
}

async function saveAndRedirect() {
  try {
    const token = getToken();
    const res = await fetch(apiUrl("/api/skills"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ learnSkills: selectedLearnSkills, teachSkills: selectedTeachSkills })
    });
    const data = await res.json().catch(function () { return {}; });
    if (!res.ok) return showMsg("error", "❌ " + (data.error || T("خطأ في حفظ المهارات", "Failed to save skills")));
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    const hasVerified = ((data.user || {}).verifiedSkills || []).length > 0;
    showMsg("success", "✅ " + (hasVerified ? T("تم حفظ مهاراتك! جاري البحث عن شركاء...", "Skills saved! Looking for partners...") : T("تم حفظ مهاراتك! الخطوة التالية: اجتز اختبار مهارة التعليم لتفعيل المطابقة", "Skills saved! Next step: pass a teaching-skill test to unlock matching")));
    setTimeout(function () { window.location.href = hasVerified ? "matching-results.html" : "skill-test.html"; }, 1200);
  } catch (err) {
    showMsg("error", "❌ " + T("خطأ في الاتصال بالسيرفر", "Server connection error"));
    console.log(err);
  }
}

function showMsg(type, text) {
  const el = document.getElementById(type === "error" ? "errorMsg" : "successMsg");
  if (!el) return;
  el.textContent = text;
  el.style.display = "block";
  if (type === "error") setTimeout(function () { el.style.display = "none"; }, 5000);
}

// استرجاع المهارات المحفوظة + مزامنة من الخادم (مصدر الحقيقة)
async function loadSavedSkills() {
  try {
    const token = getToken();
    if (!token) return;
    const res = await fetch(apiUrl("/api/me"), { headers: { Authorization: "Bearer " + token } });
    if (res.ok) {
      const data = await res.json();
      if (data.user) localStorage.setItem("currentUser", JSON.stringify(data.user));
    }
  } catch (e) { /* offline: نكمل بالنسخة المحفوظة */ }
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  verifiedSkills = user.verifiedSkills || [];
  const catalog = new Set(availableSkills);
  selectedLearnSkills = (user.learnSkills || []).filter(function (s) { return catalog.has(s); });
  selectedTeachSkills = (user.teachSkills || []).filter(function (s) { return catalog.has(s); });
}

window.onload = async function () {
  const cached = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!cached.email) { window.location.href = "login.html"; return; }
  await loadSavedSkills();
  buildSkillGrids();
  showVerifiedSection();
  renderSelected("learn");
  renderSelected("teach");
  typeof initTheme === "function" && initTheme();
  typeof initNav === "function" && initNav();
  typeof initScrollBtn === "function" && initScrollBtn();
};

const btn = document.getElementById("btn");

function smoothScrollToTop(duration) {
  const start = window.pageYOffset;
  let raf = null;
  requestAnimationFrame(function step(ts) {
    if (raf === null) raf = ts;
    const p = ts - raf, e = start, c = -start, t = p / (duration / 2);
    const val = t < 1 ? c / 2 * t * t * t + e : c / 2 * ((t -= 2) * t * t + 2) + e;
    window.scrollTo(0, val);
    if (p < duration) requestAnimationFrame(step); else window.scrollTo(0, 0);
  });
}

btn && window.addEventListener("scroll", () => { btn.style.display = window.scrollY >= 200 ? "block" : "none"; });
btn && btn.addEventListener("click", () => smoothScrollToTop(1200));
document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
document.addEventListener("keydown", function (e) {
  ("F12" === e.key || e.ctrlKey && "u" === e.key.toLowerCase() || e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) && e.preventDefault();
});
