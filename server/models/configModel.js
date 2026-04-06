import mongoose from "mongoose";

/**
 * System configuration — academic rules & evaluation weights.
 * @validation — Mongoose: GPA 0–4; duration 1–24 months; each weight 0–100 (sum validated in controller).
 */
const configSchema = new mongoose.Schema(
  {
    minGpaRequirement: { type: Number, required: true, min: 0, max: 4 },
    internshipDurationMonths: { type: Number, required: true, min: 1, max: 24 },
    evalWeightTechnical: { type: Number, required: true, min: 0, max: 100 },
    evalWeightCommunication: { type: Number, required: true, min: 0, max: 100 },
    evalWeightAttendance: { type: Number, required: true, min: 0, max: 100 },
    updatedBy: { type: String, default: "system" },
  },
  { timestamps: true }
);

const ConfigModel =
  mongoose.models.ConfigModel || mongoose.model("ConfigModel", configSchema);

export default ConfigModel;
