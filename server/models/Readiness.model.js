import mongoose from "mongoose";

const readinessSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true, 
        unique: true 
    },
    cvUrl: { type: String, default: "" },
    academicPerformance: { type: String, default: "" },
    skillGaps: { type: [String], default: [] },
    suggestedCourses: { type: [String], default: [] },
    interviewNotes: { type: String, default: "" },
    status: { 
        type: String, 
        enum: ['Pending', 'In Review', 'Ready'], 
        default: 'Pending' 
    },
    isEligible: { type: Boolean, default: false }
}, { timestamps: true });

const Readiness = mongoose.model("Readiness", readinessSchema);

export default Readiness;