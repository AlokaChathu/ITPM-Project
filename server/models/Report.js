import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Weekly", "Monthly"],
      required: true,
    },
    weekNumber: {
      type: Number,
      default: null,
    },
    monthNumber: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Submitted", "Reviewed", "Late"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;