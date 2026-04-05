import mongoose from "mongoose";

const backupSchema = new mongoose.Schema(
  {
    usersSnapshot: { type: Array, default: [] },
    configSnapshot: { type: Object, default: {} },
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const BackupModel =
  mongoose.models.BackupModel || mongoose.model("BackupModel", backupSchema);

export default BackupModel;
