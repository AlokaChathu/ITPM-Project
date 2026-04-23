import express from 'express';
import companyAuth from '../middleware/companyAuth.js';
import adminAuth from '../middleware/AdminAuth.js';
import { 
    submitFeedback, 
    getCompanyFeedbacks, 
    getAllFeedbacks 
} from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

// ---- Company Routes ----
feedbackRouter.post('/submit', companyAuth, submitFeedback);
feedbackRouter.get('/company', companyAuth, getCompanyFeedbacks);

// ---- Admin Routes ----
feedbackRouter.get('/all', adminAuth, getAllFeedbacks);

export default feedbackRouter;
