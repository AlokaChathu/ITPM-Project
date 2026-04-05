import Message from "../models/Message.model.js";

// [ADMIN] Send a message to a student
export const sendMessage = async (req, res) => {
    try {
        const { studentId, text } = req.body;

        if (!studentId || !text) {
            return res.json({ success: false, message: "Student ID and message text are required." });
        }

        const newMessage = new Message({ studentId, text });
        await newMessage.save();

        res.json({ success: true, message: "Message sent to student successfully!", data: newMessage });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT] Get all their messages
export const getMyMessages = async (req, res) => {
    try {
        const studentId = req.userId;
        const messages = await Message.find({ studentId }).sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT] Mark a message as read
export const markMessageRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndUpdate(messageId, { isRead: true });
        res.json({ success: true, message: "Message marked as read." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= NEW ADMIN FEATURES =================

// [ADMIN] Get message history for a specific student
export const getStudentMessages = async (req, res) => {
    try {
        const { studentId } = req.params;
        // Fetch messages for this student, oldest to newest so it looks like a chat log
        const messages = await Message.find({ studentId }).sort({ createdAt: 1 });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Update an unread message
export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const message = await Message.findById(messageId);
        
        if (!message) return res.json({ success: false, message: "Message not found." });
        
        // Safety check: Prevent editing if the student already read it
        if (message.isRead) {
            return res.json({ success: false, message: "Cannot edit this message because the student has already read it." });
        }

        message.text = text;
        await message.save();

        res.json({ success: true, message: "Message updated successfully." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        
        const message = await Message.findById(messageId);
        if (!message) return res.json({ success: false, message: "Message not found." });

        await Message.findByIdAndDelete(messageId);
        res.json({ success: true, message: "Message deleted successfully." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};