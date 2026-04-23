import VivaSchedule from "../models/VivaSchedule.model.js";

// [ADMIN] Create a new viva schedule
export const createSchedule = async (req, res) => {
  try {
    const { studentId, studentName, date, time, venue, notes, status } = req.body;
    
    const newSchedule = new VivaSchedule({
      studentId,
      studentName,
      date,
      time,
      venue,
      notes: notes || '',
      status: status || 'Scheduled'
    });
    
    await newSchedule.save();
    
    res.json({ success: true, message: "Viva schedule created successfully", data: newSchedule });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// [STUDENT] Get viva schedule for a specific student
export const getStudentSchedule = async (req, res) => {
  try {
    const studentId = req.userId;
    
    const schedule = await VivaSchedule.findOne({ studentId });
    
    if (!schedule) {
      return res.json({ success: true, data: null });
    }
    
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// [ADMIN] Get all viva schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await VivaSchedule.find()
      .populate('studentId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// [ADMIN] Update viva schedule
export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { studentId, studentName, date, time, venue, notes, status } = req.body;
    
    const schedule = await VivaSchedule.findById(scheduleId);
    
    if (!schedule) {
      return res.json({ success: false, message: "Viva schedule not found." });
    }
    
    if (studentId !== undefined) schedule.studentId = studentId;
    if (studentName !== undefined) schedule.studentName = studentName;
    if (date !== undefined) schedule.date = date;
    if (time !== undefined) schedule.time = time;
    if (venue !== undefined) schedule.venue = venue;
    if (notes !== undefined) schedule.notes = notes;
    if (status !== undefined) schedule.status = status;
    
    await schedule.save();
    
    res.json({ success: true, message: "Viva schedule updated successfully", data: schedule });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// [ADMIN] Delete viva schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    await VivaSchedule.findByIdAndDelete(scheduleId);
    
    res.json({ success: true, message: "Viva schedule deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
