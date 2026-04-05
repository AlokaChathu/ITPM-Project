import mongoose from "mongoose";

const internshipMonitoringSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Pending", "Suspended"],
      default: "Active",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const InternshipMonitoring = mongoose.model(
  "InternshipMonitoring",
  internshipMonitoringSchema
);

export default InternshipMonitoring;