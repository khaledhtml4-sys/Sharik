/* اعتماد مهارة تعليم واحدة لكل حساب تجريبي — لكي تظهر في المطابقة */
require("dotenv").config({ path: require("path").join(__dirname, "node-js كامل", ".env") });
const mongoose = require("mongoose");

const ACCOUNTS = [
  ["ahmed.hassan.d01@sharikdemo.site", "JavaScript"],
  ["mohamed.adel.d02@sharikdemo.site", "React"],
  ["omar.khaled.d03@sharikdemo.site", "UI/UX Design"],
  ["sara.mahmoud.d04@sharikdemo.site", "التسويق الرقمي"],
  ["mariam.ashraf.d05@sharikdemo.site", "كتابة المحتوى"],
  ["youssef.tarek.d06@sharikdemo.site", "Python"],
  ["nour.eldin.d07@sharikdemo.site", "HTML/CSS"],
  ["heba.mostafa.d08@sharikdemo.site", "Photoshop"],
  ["karim.mansour.d09@sharikdemo.site", "المونتاج"],
  ["fatma.ibrahim.d10@sharikdemo.site", "اللغة الإنجليزية"],
  ["amr.sherif.d11@sharikdemo.site", "إدارة المشاريع"],
  ["dalia.fathy.d12@sharikdemo.site", "إدارة المحتوى"],
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = mongoose.connection.db.collection("users");
  for (const [email, skill] of ACCOUNTS) {
    const r = await users.updateOne(
      { email },
      { $set: { verifiedSkills: [skill], onboarded: true } }
    );
    console.log(email, "→", r.matchedCount ? "verified in " + skill : "NOT FOUND");
  }
  await mongoose.disconnect();
  console.log("done");
})().catch((e) => { console.error(e.message); process.exit(1); });
