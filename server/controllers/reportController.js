import Report from "../models/Report.js";

// CREATE
export const submitReport = async (req, res) => {
  try {
    const { studentId, type, weekNumber, monthNumber, title, description } = req.body;

    const report = await Report.create({
      student: req.userId,
      studentId,
      type,
      weekNumber,
      monthNumber,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ALL
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ student: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateReport = async (req, res) => {
  try {
    const { studentId, type, weekNumber, monthNumber, title, description } = req.body;

    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, student: req.userId },
      { studentId, type, weekNumber, monthNumber, title, description },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      student: req.userId,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};