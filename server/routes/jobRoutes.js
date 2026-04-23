import express from 'express';
import adminAuth from '../middleware/AdminAuth.js';
import userAuth from '../middleware/userAuth.js';
import companyAuth from '../middleware/companyAuth.js';
import { 
    createJob, 
    getAllJobs, 
    applyForJob, 
    getJobApplications ,
    updateJob,     
    deleteJob,
    createCompanyJob,
    getCompanyJobs,
    updateCompanyJob,
    deleteCompanyJob,
    getCompanyApplications,
    updateApplicationStatus,
    getStudentApplications,
    updateInternshipStatus
} from '../controllers/jobController.js';

const jobRouter = express.Router();

// ---- Admin Routes ----
jobRouter.post('/create', adminAuth, createJob);
jobRouter.get('/applications/:jobId', adminAuth, getJobApplications);

// ---- Company Routes ----
jobRouter.post('/company/create', companyAuth, createCompanyJob);
jobRouter.get('/company/jobs', companyAuth, getCompanyJobs);
jobRouter.get('/company/applications', companyAuth, getCompanyApplications);
jobRouter.put('/company/update/:jobId', companyAuth, updateCompanyJob);
jobRouter.delete('/company/delete/:jobId', companyAuth, deleteCompanyJob);
jobRouter.put('/company/application/:applicationId', companyAuth, updateApplicationStatus);
jobRouter.put('/company/internship-status/:applicationId', companyAuth, updateInternshipStatus);

// ---- Shared & Student Routes ----
jobRouter.get('/all', getAllJobs); 
jobRouter.post('/apply', userAuth, applyForJob);
jobRouter.get('/my-applications', userAuth, getStudentApplications);
jobRouter.put('/update/:jobId', adminAuth, updateJob);     
jobRouter.delete('/delete/:jobId', adminAuth, deleteJob);

export default jobRouter;