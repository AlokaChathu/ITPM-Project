import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserById, getUserData, getUserIdByEmail,updateUser,deleteUser, updateStudentGrade } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get('/customer/:id',getUserById);
userRouter.get('/customer',getUserIdByEmail);
userRouter.put('/customer/:id',userAuth, updateUser);
userRouter.delete('/customer/:id', deleteUser);
userRouter.put('/update-grade/:id', updateStudentGrade);


export default userRouter;