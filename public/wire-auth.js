/* Wire data-i18n attributes into auth pages (login/signup/reset-password) */
const fs = require('fs');
const ROOT = __dirname;
const jobs = {
  'login-signup/login.html': [
    [`<h2 style="font-size:26px;font-weight:900;margin:0 0 8px;color:#f8fafc">مرحباً بعودتك! 👋</h2>`,
     `<h2 style="font-size:26px;font-weight:900;margin:0 0 8px;color:#f8fafc" data-i18n="au.login.t">مرحباً بعودتك! 👋</h2>`],
    [`<p style="color:#94a3b8;font-size:14px;margin:0">قم بتسجيل الدخول للاستمرار في تبادل المهارات</p>`,
     `<p style="color:#94a3b8;font-size:14px;margin:0" data-i18n="au.login.s">قم بتسجيل الدخول للاستمرار في تبادل المهارات</p>`],
    [`<span>انتهت صلاحية الجلسة السابقة. يرجى تسجيل الدخول مجدداً.</span>`,
     `<span data-i18n="au.expired">انتهت صلاحية الجلسة السابقة. يرجى تسجيل الدخول مجدداً.</span>`],
    [`<label for="inputEmail1" class="auth-label">البريد الإلكتروني:</label>`,
     `<label for="inputEmail1" class="auth-label" data-i18n="au.email">البريد الإلكتروني:</label>`],
    [`<label for="inputPassword1" class="auth-label" style="margin:0">كلمة المرور:</label>`,
     `<label for="inputPassword1" class="auth-label" style="margin:0" data-i18n="au.password">كلمة المرور:</label>`],
    [`style="color:#d3a4ef;font-size:12px;text-decoration:none">نسيت كلمة المرور؟</a>`,
     `style="color:#d3a4ef;font-size:12px;text-decoration:none" data-i18n="au.forgot">نسيت كلمة المرور؟</a>`],
    [`<label for="showPw" style="cursor:pointer">إظهار كلمة المرور</label>`,
     `<label for="showPw" style="cursor:pointer" data-i18n="au.show">إظهار كلمة المرور</label>`],
    [`<button type="submit" class="auth-submit-btn" id="inputSubmit">تسجيل الدخول 🚀</button>`,
     `<button type="submit" class="auth-submit-btn" id="inputSubmit" data-i18n="au.submit">تسجيل الدخول 🚀</button>`],
    [`            ليس لديك حساب بعد؟ <a href="signup.html" style="color:#d3a4ef;font-weight:700;text-decoration:none">قم بإنشاء حساب جديد</a>`,
     `            <span data-i18n="au.noacc">ليس لديك حساب بعد؟</span> <a href="signup.html" style="color:#d3a4ef;font-weight:700;text-decoration:none" data-i18n="au.create">قم بإنشاء حساب جديد</a>`],
    [`          💡 أكبر مجتمع تبادل مهارات تقنية`,
     `          <span data-i18n="au.login.badge">💡 أكبر مجتمع تبادل مهارات تقنية</span>`],
    [`          تعلّم مهارات جديدة مجاناً مقابل ما تتقنه`,
     `          <span data-i18n="au.login.hero.h">تعلّم مهارات جديدة مجاناً مقابل ما تتقنه</span>`],
    [`          انضم لأكثر من 10,000+ مطور ومصمم ومتخصص يتبادلون الخبرات البرمجية والتقنية في مصر والوطن العربي بأسلوب سلس ومباشر.`,
     `          <span data-i18n="au.login.hero.p">انضم لأكثر من 10,000+ مطور ومصمم ومتخصص يتبادلون الخبرات البرمجية والتقنية في مصر والوطن العربي بأسلوب سلس ومباشر.</span>`],
    [`display:block">مطابقة ذكية فورية</strong>`, `display:block" data-i18n="au.login.c1">مطابقة ذكية فورية</strong>`],
    [`color:#94a3b8">خوارزميات تطابق مهاراتك بدقة</span>`, `color:#94a3b8" data-i18n="au.login.c1s">خوارزميات تطابق مهاراتك بدقة</span>`],
    [`display:block">محرر كود وبث مباشر</strong>`, `display:block" data-i18n="au.login.c2">محرر كود وبث مباشر</strong>`],
    [`color:#94a3b8">محادثة تفاعلية وسريعة</span>`, `color:#94a3b8" data-i18n="au.login.c2s">محادثة تفاعلية وسريعة</span>`],
    [`gap:8px;">🔑 استعادة كلمة المرور</h3>`, `gap:8px;" data-i18n="au.forgot.t">🔑 استعادة كلمة المرور</h3>`],
    [`margin-bottom:20px;">أدخل البريد الإلكتروني الخاص بك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>`,
     `margin-bottom:20px;" data-i18n="au.forgot.p">أدخل البريد الإلكتروني الخاص بك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>`],
    [`<label style="display:block; margin-bottom:6px; font-weight:bold; color:#94a3b8; font-size:12px;">البريد الإلكتروني:</label>`,
     `<label style="display:block; margin-bottom:6px; font-weight:bold; color:#94a3b8; font-size:12px;" data-i18n="au.email">البريد الإلكتروني:</label>`],
    [`font-family:inherit;">إلغاء</button>`, `font-family:inherit;" data-i18n="au.cancel">إلغاء</button>`],
    [`font-family:inherit;">إرسال الرابط ✅</button>`, `font-family:inherit;" data-i18n="au.send">إرسال الرابط ✅</button>`],
  ],
  'login-signup/signup.html': [
    [`<h2 style="font-size:26px;font-weight:900;margin:0 0 8px;color:#f8fafc">انضم إلى شارك مجاناً 🚀</h2>`,
     `<h2 style="font-size:26px;font-weight:900;margin:0 0 8px;color:#f8fafc" data-i18n="au.signup.t">انضم إلى شارك مجاناً 🚀</h2>`],
    [`<p style="color:#94a3b8;font-size:14px;margin:0">أنشئ حسابك وابدأ التبادل والتطوير الآن</p>`,
     `<p style="color:#94a3b8;font-size:14px;margin:0" data-i18n="au.signup.s">أنشئ حسابك وابدأ التبادل والتطوير الآن</p>`],
    [`<label for="inputName" class="auth-label">الاسم الأول:</label>`, `<label for="inputName" class="auth-label" data-i18n="au.first">الاسم الأول:</label>`],
    [`<label for="inputName2" class="auth-label">اسم العائلة:</label>`, `<label for="inputName2" class="auth-label" data-i18n="au.last">اسم العائلة:</label>`],
    [`<label for="inputEmail" class="auth-label">البريد الإلكتروني:</label>`, `<label for="inputEmail" class="auth-label" data-i18n="au.email">البريد الإلكتروني:</label>`],
    [`<label for="inputPassword" class="auth-label">كلمة المرور:</label>`, `<label for="inputPassword" class="auth-label" data-i18n="au.password">كلمة المرور:</label>`],
    [`<label for="showPw" style="cursor:pointer">إظهار كلمة المرور</label>`, `<label for="showPw" style="cursor:pointer" data-i18n="au.show">إظهار كلمة المرور</label>`],
    [`              أوافق على <a href="/footer/Provisions.html" style="color:#d3a4ef;text-decoration:none">الشروط والأحكام</a> و <a href="/footer/conditions.html" style="color:#d3a4ef;text-decoration:none">سياسة الخصوصية</a>`,
     `              <span data-i18n="au.terms.pre">أوافق على</span> <a href="/footer/Provisions.html" style="color:#d3a4ef;text-decoration:none" data-i18n="au.terms.toc">الشروط والأحكام</a> <span data-i18n="au.terms.and">و</span> <a href="/footer/conditions.html" style="color:#d3a4ef;text-decoration:none" data-i18n="au.terms.pp">سياسة الخصوصية</a>`],
    [`<button id="inputSubmit" class="auth-submit-btn" type="submit">إنشاء الحساب والمتابعة ✦</button>`,
     `<button id="inputSubmit" class="auth-submit-btn" type="submit" data-i18n="au.submitUp">إنشاء الحساب والمتابعة ✦</button>`],
    [`            لديك حساب بالفعل؟ <a href="login.html" style="color:#10b981;font-weight:700;text-decoration:none">تسجيل الدخول</a>`,
     `            <span data-i18n="au.haveacc">لديك حساب بالفعل؟</span> <a href="login.html" style="color:#10b981;font-weight:700;text-decoration:none" data-i18n="cta.login">تسجيل الدخول</a>`],
    [`          🎉 حساب مجاني مدى الحياة ✦`, `          <span data-i18n="au.badge">🎉 حساب مجاني مدى الحياة ✦</span>`],
    [`          اكسب ميزة تنافسية في وقت قياسي`, `          <span data-i18n="au.hero.h">اكسب ميزة تنافسية في وقت قياسي</span>`],
    [`          التحق بمنصة تبادل المهارات التقنية، واحصل على توثيق معتمد لمهاراتك، وطوّر مستواك التقني مع خبراء ومطورين حقيقيين.`,
     `          <span data-i18n="au.hero.p">التحق بمنصة تبادل المهارات التقنية، واحصل على توثيق معتمد لمهاراتك، وطوّر مستواك التقني مع خبراء ومطورين حقيقيين.</span>`],
    [`display:block">شهادات معتمدة</strong>`, `display:block" data-i18n="au.hero.c1">شهادات معتمدة</strong>`],
    [`<span style="font-size:12px;color:#94a3b8">أثبت مهاراتك عبر اختبارات المهارات</span>`, `<span style="font-size:12px;color:#94a3b8" data-i18n="au.hero.c1s">أثبت مهاراتك عبر اختبارات المهارات</span>`],
    [`display:block">نقاط خبرة وترتيب</strong>`, `display:block" data-i18n="au.hero.c2">نقاط خبرة وترتيب</strong>`],
    [`<span style="font-size:12px;color:#94a3b8">تنافس في لوحة المتصدرين</span>`, `<span style="font-size:12px;color:#94a3b8" data-i18n="au.hero.c2s">تنافس في لوحة المتصدرين</span>`],
  ],
  'login-signup/reset-password.html': [
    [`<h1 style="margin-bottom:8px;">إعادة تعيين كلمة المرور</h1>`, `<h1 style="margin-bottom:8px;" data-i18n="au.reset.t">إعادة تعيين كلمة المرور</h1>`],
    [`<p style="color:#888;margin-bottom:24px;">أدخل كلمة مرور جديدة (8 أحرف على الأقل)</p>`, `<p style="color:#888;margin-bottom:24px;" data-i18n="au.reset.s">أدخل كلمة مرور جديدة (8 أحرف على الأقل)</p>`],
    [`<label style="display:block;margin-bottom:8px;">كلمة المرور الجديدة</label>`, `<label style="display:block;margin-bottom:8px;" data-i18n="au.reset.l1">كلمة المرور الجديدة</label>`],
    [`<label style="display:block;margin-bottom:8px;">تأكيد كلمة المرور</label>`, `<label style="display:block;margin-bottom:8px;" data-i18n="au.reset.l2">تأكيد كلمة المرور</label>`],
    [`cursor:pointer;"> حفظ كلمة المرور </button>`, `cursor:pointer;" data-i18n="au.reset.btn"> حفظ كلمة المرور </button>`],
    [`<a href="login.html">العودة لتسجيل الدخول</a>`, `<a href="login.html" data-i18n="au.reset.back">العودة لتسجيل الدخول</a>`],
  ],
};
let fail = 0;
for (const [file, reps] of Object.entries(jobs)) {
  let s = fs.readFileSync(require('path').join(ROOT, file), 'utf8');
  for (const [a, b] of reps) {
    if (!s.includes(a)) { console.log('NOT FOUND in', file, '->', a.slice(0, 70)); fail++; continue; }
    s = s.split(a).join(b);
  }
  fs.writeFileSync(require('path').join(ROOT, file), s);
}
console.log(fail === 0 ? 'ALL AUTH WIRED OK' : 'FAILURES: ' + fail);
