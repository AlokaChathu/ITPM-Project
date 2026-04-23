import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    description: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, enum: ['Full-time', 'Part-time'], default: 'Full-time' },
    techStack: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;