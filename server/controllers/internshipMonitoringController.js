import InternshipMonitoring from "../models/InternshipMonitoring.js";

// CREATE internship monitoring record
export const createInternshipMonitoring = async (req, res) => {
  try {
    const { studentId, studentName, startDate, endDate } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!studentId || !studentName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const internship = await InternshipMonitoring.create({
      student: req.userId,
      studentId,
      studentName,
      startDate,
      endDate,
      status: "Active",
      progress: 0,
      lastActivityDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Internship monitoring record created successfully",
      internship,
    });
  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET all internship monitoring records for logged user
export const getMyInternshipMonitoring = async (req, res) => {
  try {
    const internships = await InternshipMonitoring.find({
      student: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      internships,
    });
  } catch (error) {
    console.log("FETCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single internship monitoring record
export const getSingleInternshipMonitoring = async (req, res) => {
  try {
    const internship = await InternshipMonitoring.findOne({
      _id: req.params.id,
      student: req.userId,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship monitoring record not found",
      });
    }

    res.json({
      success: true,
      internship,
    });
  } catch (error) {
    console.log("GET SINGLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE internship monitoring record
export const updateInternshipMonitoring = async (req, res) => {
  try {
    const { studentId, studentName, startDate, endDate, status, progress } = req.body;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const internship = await InternshipMonitoring.findOneAndUpdate(
      { _id: req.params.id, student: req.userId },
      {
        studentId,
        studentName,
        startDate,
        endDate,
        status,
        progress,
        lastActivityDate: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship monitoring record not found",
      });
    }

    res.json({
      success: true,
      message: "Internship monitoring record updated successfully",
      internship,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE internship monitoring record
export const deleteInternshipMonitoring = async (req, res) => {
  try {
    const internship = await InternshipMonitoring.findOneAndDelete({
      _id: req.params.id,
      student: req.userId,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship monitoring record not found",
      });
    }

    res.json({
      success: true,
      message: "Internship monitoring record deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};