import express from 'express'
import { adminRegister, loginAdmin, logout, verifyAdmin } from '../controllers/Admin.controller.js';
import adminAuth from '../middleware/AdminAuth.js';

const router = express.Router();

router.post('/register',adminRegister);
router.post('/login',loginAdmin);
router.get('/logout',adminAuth,logout);
router.get('/verify',adminAuth,verifyAdmin);

export default router;
