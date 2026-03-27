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
readinessRouter.post('/submit', submitReadinessDetails);
readinessRouter.get('/my-status', userAuth, getStudentReadiness);

// ---- Admin Routes ----
readinessRouter.get('/all', getAllEvaluations);
readinessRouter.get('/student/:studentId', getStudentReadiness);
readinessRouter.put('/evaluate/:studentId', evaluateStudent);

export default readinessRouter;