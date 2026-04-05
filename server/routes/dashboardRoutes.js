import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/student', userAuth, getDashboardData);

export default router;