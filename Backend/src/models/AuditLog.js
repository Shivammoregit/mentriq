const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actorEmail: { type: String, default: "" },
    actorRole: { type: String, default: "" },
    method: { type: String, required: true },
    path: { type: String, required: true },
    entity: { type: String, default: "" },
    action: { type: String, default: "" },
    statusCode: { type: Number, required: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
