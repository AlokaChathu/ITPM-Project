import express from 'express';
import adminAuth from '../middleware/AdminAuth.js';
import userAuth from '../middleware/userAuth.js';
import { 
  createSchedule, 
  getStudentSchedule, 
  getAllSchedules, 
  updateSchedule, 
  deleteSchedule 
} from '../controllers/vivaScheduleController.js';

const vivaScheduleRouter = express.Router();

// ---- Admin Routes ----
vivaScheduleRouter.post('/create', adminAuth, createSchedule);
vivaScheduleRouter.get('/all', adminAuth, getAllSchedules);
vivaScheduleRouter.put('/:scheduleId', adminAuth, updateSchedule);
vivaScheduleRouter.delete('/:scheduleId', adminAuth, deleteSchedule);

// ---- Student Routes ----
vivaScheduleRouter.get('/student', userAuth, getStudentSchedule);

export default vivaScheduleRouter;
