import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

// Ensure one feedback per application
feedbackSchema.index({ applicationId: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
