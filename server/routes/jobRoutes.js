import express from 'express';
import adminAuth from '../middleware/AdminAuth.js';
import userAuth from '../middleware/userAuth.js';
import { 
    createJob, 
    getAllJobs, 
    applyForJob, 
    getJobApplications ,
    updateJob,     
    deleteJob
} from '../controllers/jobController.js';

const jobRouter = express.Router();

// ---- Admin Routes ----
jobRouter.post('/create', adminAuth, createJob);
jobRouter.get('/applications/:jobId', adminAuth, getJobApplications);

// ---- Shared & Student Routes ----
jobRouter.get('/all', getAllJobs); 
jobRouter.post('/apply', userAuth, applyForJob);
jobRouter.put('/update/:jobId', adminAuth, updateJob);     
jobRouter.delete('/delete/:jobId', adminAuth, deleteJob);

export default jobRouter;