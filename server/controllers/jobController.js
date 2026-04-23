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

// [COMPANY] Create a new internship posting for the authenticated company
export const createCompanyJob = async (req, res) => {
    try {
        const { title, company, description, location, type, techStack } = req.body;
        const companyId = req.userId;
        
        const newJob = new Job({ 
            title, 
            company, 
            companyId,
            description, 
            location,
            type,
            techStack 
        });
        await newJob.save();
        
        res.json({ success: true, message: "Internship posted successfully", data: newJob });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [COMPANY] Get all jobs for the authenticated company
export const getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.userId;
        const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });
        res.json({ success: true, data: jobs });
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

        // Check if they already applied
        const existingApp = await Application.findOne({ jobId, studentId });
        if (existingApp) {
            return res.json({ success: false, message: "You have already applied for this position." });
        }

        // Create the application
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

// [COMPANY] Update company's own internship posting
export const updateCompanyJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { title, company, description, location, type, techStack, isActive } = req.body;
        const companyId = req.userId;

        const job = await Job.findOne({ _id: jobId, companyId });
        if (!job) {
            return res.json({ success: false, message: "Job not found or not authorized." });
        }

        if (title !== undefined) job.title = title;
        if (company !== undefined) job.company = company;
        if (description !== undefined) job.description = description;
        if (location !== undefined) job.location = location;
        if (type !== undefined) job.type = type;
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

// [COMPANY] Delete company's own internship posting
export const deleteCompanyJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.userId;

        const job = await Job.findOne({ _id: jobId, companyId });
        if (!job) {
            return res.json({ success: false, message: "Job not found or not authorized." });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);
        
        // Clean up: Delete all applications associated with this job
        await Application.deleteMany({ jobId });

        res.json({ success: true, message: "Internship and associated applications deleted." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [COMPANY] Get all applications for company's jobs
export const getCompanyApplications = async (req, res) => {
    try {
        const companyId = req.userId;
        
        // Get all jobs for this company
        const jobs = await Job.find({ companyId }).select('_id title');
        const jobIds = jobs.map(job => job._id);
        
        // Get all applications for these jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('studentId', 'name email phone')
            .populate('jobId', 'title company')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [COMPANY] Update application status (accept/reject)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const companyId = req.userId;
        
        // Find the application and populate the job to check ownership
        const application = await Application.findById(applicationId).populate('jobId');
        
        if (!application) {
            return res.json({ success: false, message: "Application not found." });
        }
        
        // Verify the job belongs to this company
        if (application.jobId.companyId.toString() !== companyId.toString()) {
            return res.json({ success: false, message: "Not authorized to update this application." });
        }
        
        // Validate status
        if (!['Applied', 'Interviewing', 'Accepted', 'Rejected'].includes(status)) {
            return res.json({ success: false, message: "Invalid status." });
        }
        
        application.status = status;
        
        // Set internship status to 'ongoing' when application is accepted
        if (status === 'Accepted' && !application.internshipStatus) {
            application.internshipStatus = 'ongoing';
        }
        
        await application.save();
        
        res.json({ success: true, message: "Application status updated successfully.", data: application });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT] Get all applications for the authenticated student
export const getStudentApplications = async (req, res) => {
    try {
        const studentId = req.userId;
        
        const applications = await Application.find({ studentId })
            .populate('jobId', 'title company')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [COMPANY] Update internship status (ongoing/completed)
export const updateInternshipStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { internshipStatus } = req.body;
        const companyId = req.userId;
        
        // Find the application and populate the job to check ownership
        const application = await Application.findById(applicationId).populate('jobId');
        
        if (!application) {
            return res.json({ success: false, message: "Application not found." });
        }
        
        // Verify the job belongs to this company
        if (application.jobId.companyId.toString() !== companyId.toString()) {
            return res.json({ success: false, message: "Not authorized to update this application." });
        }
        
        // Validate internship status
        if (!['ongoing', 'completed'].includes(internshipStatus)) {
            return res.json({ success: false, message: "Invalid internship status." });
        }
        
        application.internshipStatus = internshipStatus;
        await application.save();
        
        res.json({ success: true, message: "Internship status updated successfully.", data: application });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};