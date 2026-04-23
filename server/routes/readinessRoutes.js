import express from 'express';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/AdminAuth.js';
import companyAuth from '../middleware/companyAuth.js';
import { 
    submitReadinessDetails, 
    getStudentReadiness, 
    getAllEvaluations, 
    evaluateStudent,
    getStudentFullDetails
} from '../controllers/readinessController.js';

const readinessRouter = express.Router();

// ---- Student Routes ----
readinessRouter.post('/submit', submitReadinessDetails);
readinessRouter.get('/my-status', userAuth, getStudentReadiness);

// ---- Admin Routes ----
readinessRouter.get('/all', getAllEvaluations);
readinessRouter.get('/student/:studentId', getStudentReadiness);
readinessRouter.put('/evaluate/:studentId', evaluateStudent);

// ---- Company Routes ----
readinessRouter.get('/student-details/:studentId', companyAuth, getStudentFullDetails);

export default readinessRouter;