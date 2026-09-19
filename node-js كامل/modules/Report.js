const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    reporterEmail: { type: String, required: true },
    reporterName: { type: String, default: "" },
    reportedEmail: { type: String, required: true },
    reportedName: { type: String, default: "" },
    reason: { type: String, required: true },
    category: {
      type: String,
      enum: ["spam", "harassment", "fraud", "inappropriate", "fake_account", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    evidence: { type: String, default: "" }, // نص أو رابط كدليل
    chatId: { type: String },
    status: { type: String, enum: ["open", "pending", "reviewing", "reviewed", "resolved", "closed"], default: "open" },
    adminNotes: { type: String, default: "" },
    actionTaken: { type: String, default: "" },
    handledBy: { type: String, default: "" },
    handledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reportedEmail: 1, createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
