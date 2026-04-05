import express from 'express';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/AdminAuth.js';
import { getMyPortfolio, updateSkills, getAllPortfolios } from '../controllers/portfolioController.js';

const portfolioRouter = express.Router();

// Student routes
portfolioRouter.get('/my-portfolio', userAuth, getMyPortfolio);
portfolioRouter.post('/update-skills', userAuth, updateSkills);

// Admin route
portfolioRouter.get('/all', adminAuth, getAllPortfolios);

export default portfolioRouter;