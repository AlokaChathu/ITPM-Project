import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { createIssue, getMyIssues } from '../controllers/issueController.js';

const router = express.Router();

router.post('/', userAuth, createIssue);
router.get('/my', userAuth, getMyIssues);

export default router;
