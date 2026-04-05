import express from 'express';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/AdminAuth.js';
import { 
    sendMessage, 
    getMyMessages, 
    markMessageRead,
    getStudentMessages,
    updateMessage,
    deleteMessage
} from '../controllers/messageController.js';

const messageRouter = express.Router();

// ---- Admin Routes ----
messageRouter.post('/send', adminAuth, sendMessage);
messageRouter.get('/student/:studentId', adminAuth, getStudentMessages);
messageRouter.put('/update/:messageId', adminAuth, updateMessage);
messageRouter.delete('/delete/:messageId', adminAuth, deleteMessage);

// ---- Student Routes ----
messageRouter.get('/my-messages', userAuth, getMyMessages);
messageRouter.put('/read/:messageId', userAuth, markMessageRead);

export default messageRouter;