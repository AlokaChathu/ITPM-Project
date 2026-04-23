import Feedback from "../models/Feedback.model.js";
import Application from "../models/Application.model.js";

// [COMPANY] Submit feedback for a student
export const submitFeedback = async (req, res) => {
    try {
        const { applicationId, feedback, rating } = req.body;
        const companyId = req.userId;
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5." });
        }
        
        // Find the application and verify ownership
        const application = await Application.findById(applicationId).populate('jobId');
        
        if (!application) {
            return res.json({ success: false, message: "Application not found." });
        }
        
        // Verify the job belongs to this company
        if (application.jobId.companyId.toString() !== companyId.toString()) {
            return res.json({ success: false, message: "Not authorized to submit feedback for this application." });
        }
        
        // Check if feedback already exists
        let existingFeedback = await Feedback.findOne({ applicationId });
        
        if (existingFeedback) {
            // Update existing feedback
            existingFeedback.feedback = feedback;
            existingFeedback.rating = rating;
            await existingFeedback.save();
            return res.json({ success: true, message: "Feedback updated successfully.", data: existingFeedback });
        } else {
            // Create new feedback
            const newFeedback = new Feedback({
                studentId: application.studentId,
                companyId: companyId,
                applicationId: applicationId,
                feedback,
                rating
            });
            await newFeedback.save();
            return res.json({ success: true, message: "Feedback submitted successfully.", data: newFeedback });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [COMPANY] Get all feedbacks submitted by the company
export const getCompanyFeedbacks = async (req, res) => {
    try {
        const companyId = req.userId;
        
        const feedbacks = await Feedback.find({ companyId })
            .populate('studentId', 'name email')
            .populate('applicationId')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Get all feedbacks (for Lecture Dashboard)
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('studentId', 'name email')
            .populate('companyId', 'name email')
            .populate('applicationId')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
