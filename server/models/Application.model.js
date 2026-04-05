import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    status: { 
        type: String, 
        enum: ['Applied', 'Interviewing', 'Accepted', 'Rejected'], 
        default: 'Applied' 
    }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;