import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'user',
      required: true,
      unique: true 
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    internshipTitle: { type: String, required: true },
    company: { type: String, required: true },
    fileId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending Review", "Approved", "Rejected"],
      default: "Pending Review"
    },
    mark: { type: Number, default: null },
    feedback: { type: String, default: "" },
    submittedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);

export default reportModel;
