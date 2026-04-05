import Report from "../models/Report.js";

// CREATE
export const submitReport = async (req, res) => {
  try {
    const {
      studentId,
      type,
      weekNumber,
      monthNumber,
      title,
      description,
    } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const cleanStudentId = studentId?.trim();
    const cleanTitle = title?.trim();
    const cleanDescription = description?.trim();

    if (!cleanStudentId || !type || !cleanTitle || !cleanDescription) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (type === "Weekly" && (!weekNumber || Number(weekNumber) < 1)) {
      return res.status(400).json({
        success: false,
        message: "Week number is required for weekly reports",
      });
    }

    if (type === "Monthly" && (!monthNumber || Number(monthNumber) < 1)) {
      return res.status(400).json({
        success: false,
        message: "Month number is required for monthly reports",
      });
    }

    const report = await Report.create({
      student: req.userId,
      studentId: cleanStudentId,
      type,
      weekNumber: type === "Weekly" ? Number(weekNumber) : null,
      monthNumber: type === "Monthly" ? Number(monthNumber) : null,
      title: cleanTitle,
      description: cleanDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.log("submitReport error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ ALL
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ student: req.userId }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateReport = async (req, res) => {
  try {
    const {
      studentId,
      type,
      weekNumber,
      monthNumber,
      title,
      description,
    } = req.body;

    const cleanStudentId = studentId?.trim();
    const cleanTitle = title?.trim();
    const cleanDescription = description?.trim();

    if (!cleanStudentId || !type || !cleanTitle || !cleanDescription) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (type === "Weekly" && (!weekNumber || Number(weekNumber) < 1)) {
      return res.status(400).json({
        success: false,
        message: "Week number is required for weekly reports",
      });
    }

    if (type === "Monthly" && (!monthNumber || Number(monthNumber) < 1)) {
      return res.status(400).json({
        success: false,
        message: "Month number is required for monthly reports",
      });
    }

    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, student: req.userId },
      {
        studentId: cleanStudentId,
        type,
        weekNumber: type === "Weekly" ? Number(weekNumber) : null,
        monthNumber: type === "Monthly" ? Number(monthNumber) : null,
        title: cleanTitle,
        description: cleanDescription,
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.json({
      success: true,
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.log("updateReport error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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

    return res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};