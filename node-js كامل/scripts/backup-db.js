/**
 * ─────────────────────────────────────────────────────────────
 * Sharik DB Backup — نسخ احتياطي مجدول لقاعدة البيانات
 * ─────────────────────────────────────────────────────────────
 * الاستخدام:
 *   node scripts/backup-db.js
 *
 * الجدولة (أمثلة):
 *   Linux cron — يومياً 3 صباحاً:
 *     0 3 * * * cd /app && node scripts/backup-db.js >> backup.log 2>&1
 *   Railway: استخدم Cron job service أو GitHub Action مجدولة
 *     تستدعي هذا السكربت عبر SSH أو Railway Volume.
 *
 * المتغيرات:
 *   MONGODB_URI            — اتصال القاعدة (إلزامي)
 *   BACKUP_DIR             — مجلد الحفظ (افتراضي ./backups)
 *   BACKUP_KEEP            — عدد النسخ المحفوظة (افتراضي 7)
 * ─────────────────────────────────────────────────────────────
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const URI = process.env.MONGODB_URI || "";
const KEEP = Number(process.env.BACKUP_KEEP || 7);
const DIR = path.resolve(process.env.BACKUP_DIR || path.join(__dirname, "..", "backups"));

if (!URI) {
  console.error("❌ MONGODB_URI غير مضبوط — لا يمكن النسخ الاحتياطي");
  process.exit(1);
}

function mask(u) {
  return String(u).replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const target = path.join(DIR, "sharik-backup-" + stamp);

try {
  fs.mkdirSync(DIR, { recursive: true });
  console.log("📦 Backup →", mask(URI), "@", target);
  execSync(`mongodump --uri "${URI}" --out "${target}"`, { stdio: "inherit" });

  // دوران النسخ: احتفظ بآخر KEEP فقط
  const entries = fs
    .readdirSync(DIR)
    .filter((d) => d.startsWith("sharik-backup-"))
    .sort();
  while (entries.length > KEEP) {
    const old = entries.shift();
    fs.rmSync(path.join(DIR, old), { recursive: true, force: true });
    console.log("🧹 removed old backup:", old);
  }
  console.log("✅ Backup done:", target);
} catch (err) {
  console.error("❌ Backup failed:", err.message);
  process.exit(1);
}
