import express from 'express';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/AdminAuth.js';
import { 
    submitReadinessDetails, 
    getStudentReadiness, 
    getAllEvaluations, 
    evaluateStudent 
} from '../controllers/readinessController.js';

const readinessRouter = express.Router();

// ---- Student Routes ----
readinessRouter.post('/submit', userAuth, submitReadinessDetails);
readinessRouter.get('/my-status', userAuth, getStudentReadiness);

// ---- Admin Routes ----
readinessRouter.get('/all', adminAuth, getAllEvaluations);
readinessRouter.get('/student/:studentId', adminAuth, getStudentReadiness);
readinessRouter.put('/evaluate/:studentId', adminAuth, evaluateStudent);

export default readinessRouter;