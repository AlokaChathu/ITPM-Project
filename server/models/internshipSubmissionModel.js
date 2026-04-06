import mongoose from "mongoose";

const internshipSubmissionSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    /** Sector/category for analytics dashboards. */
    category: { type: String, default: "General", trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const InternshipSubmission =
  mongoose.models.InternshipSubmission ||
  mongoose.model("InternshipSubmission", internshipSubmissionSchema);

export default InternshipSubmission;
