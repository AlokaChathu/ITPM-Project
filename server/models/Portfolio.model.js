import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true, 
        unique: true 
    },
    skills: { type: [String], default: [] }
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;