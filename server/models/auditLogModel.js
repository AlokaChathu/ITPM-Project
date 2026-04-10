import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    target: { type: String, required: true },
    actor: { type: String, default: "admin" },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const AuditLogModel =
  mongoose.models.AuditLogModel || mongoose.model("AuditLogModel", auditLogSchema);

export default AuditLogModel;
