/* اختبار SMTP بأمر واحد:
   node scripts/test-smtp.js              → التحقق من الاتصال والمصادقة فقط
   node scripts/test-smtp.js --send a@b.c → يرسل رسالة اختبار فعلية إلى العنوان */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || process.env.MAIL_FROM || user;

console.log("SMTP config:", {
  host: host || "(فارغ)",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true",
  user: user || "(فارغ)",
  pass: pass ? "✔ مُعبأ" : "✘ فارغ",
  from: from || "(فارغ — سيُستخدم SMTP_USER)",
});

if (!host || !user || !pass) {
  console.error("\n✘ الإعداد غير مكتمل. املأ في .env:");
  console.error("  SMTP_USER = بريدك (مثل your@gmail.com)");
  console.error("  SMTP_PASS = كلمة مرور التطبيقات (Gmail: Security → App passwords)");
  console.error("  MAIL_FROM = Sharik <نفس بريدك>");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user, pass },
});

(async () => {
  try {
    await transporter.verify();
    console.log("\n✔ الاتصال بـ" + host + " ناجح وبيانات الدخول صحيحة — البريد جاهز للعمل");
  } catch (err) {
    console.error("\n✘ فشل الاتصال:", err.message);
    if (/auth/i.test(err.message) && /gmail/i.test(host || "")) {
      console.error("  Gmail يتطلب كلمة مرور تطبيقات (16 حرفًا) وليس كلمة مرور الحساب،");
      console.error("  والتحقق بخطوتين مفعّل: Security → 2-Step Verification → App passwords");
    }
    process.exit(1);
  }

  const sendTo = process.argv.includes("--send") ? process.argv[process.argv.indexOf("--send") + 1] : null;
  if (sendTo) {
    try {
      const info = await transporter.sendMail({
        from: from || user,
        to: sendTo,
        subject: "رسالة اختبار — منصة شارك",
        text: "إذا وصلك هذا فخدمة البريد تعمل بنجاح.",
      });
      console.log("✔ أُرسلت رسالة الاختبار إلى", sendTo, "| id:", info.messageId);
    } catch (err) {
      console.error("✘ فشل إرسال رسالة الاختبار:", err.message);
      process.exit(1);
    }
  } else {
    console.log("(لتجربة إرسال فعلي: node scripts/test-smtp.js --send بريدك@ example.com)");
  }
})();
