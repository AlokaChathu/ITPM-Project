import Issue from "../models/Issue.js";
import Internship from "../models/Internship.js";

export const createIssue = async (req, res) => {
  try {
    const { internshipId, issueType, subject, description, priority } = req.body;

    const issue = await Issue.create({
      internship: internshipId,
      student: req.userId,
      issueType,
      subject,
      description,
      priority,
    });

    await Internship.findByIdAndUpdate(internshipId, {
      lastActivityDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      issue,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ student: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      issues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};