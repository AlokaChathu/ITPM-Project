import express from 'express';
import companyAuth from '../middleware/companyAuth.js';
import { getCompanyDashboard, updateCompanyProfile } from '../controllers/companyController.js';


const companyRouter = express.Router();

companyRouter.get('/dashboard', companyAuth, getCompanyDashboard);
companyRouter.put('/profile', companyAuth, updateCompanyProfile);

export default companyRouter;