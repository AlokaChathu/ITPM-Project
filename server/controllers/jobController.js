import Job from "../models/Job.model.js";
import Application from "../models/Application.model.js";
import Readiness from "../models/Readiness.model.js";

// [ADMIN] Create a new internship posting
export const createJob = async (req, res) => {
    try {
        const { title, company, description, techStack } = req.body;
        
        const newJob = new Job({ title, company, description, techStack });
        await newJob.save();
        
        res.json({ success: true, message: "Internship posted successfully", data: newJob });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN/STUDENT] Get all active internships
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT] Apply for an internship
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const studentId = req.userId;

        // 1. Check if the student is Eligible first!
        const readiness = await Readiness.findOne({ studentId });
        if (!readiness || !readiness.isEligible) {
            return res.json({ 
                success: false, 
                message: "You must be approved for internship eligibility before applying." 
            });
        }

        // 2. Check if they already applied
        const existingApp = await Application.findOne({ jobId, studentId });
        if (existingApp) {
            return res.json({ success: false, message: "You have already applied for this position." });
        }

        // 3. Create the application
        const application = new Application({ jobId, studentId });
        await application.save();

        res.json({ success: true, message: "Successfully applied for the internship!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] View all applications for a specific job
export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId })
            .populate('studentId', 'name email phone')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Update an internship posting
export const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { title, company, description, techStack, isActive } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.json({ success: false, message: "Job not found." });
        }

        if (title !== undefined) job.title = title;
        if (company !== undefined) job.company = company;
        if (description !== undefined) job.description = description;
        if (techStack !== undefined) job.techStack = techStack;
        if (isActive !== undefined) job.isActive = isActive;

        await job.save();
        res.json({ success: true, message: "Internship updated successfully!", data: job });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Delete an internship posting
export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Delete the job
        await Job.findByIdAndDelete(jobId);
        
        // Clean up: Delete all applications associated with this job
        await Application.deleteMany({ jobId });

        res.json({ success: true, message: "Internship and associated applications deleted." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};