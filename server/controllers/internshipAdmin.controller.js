import InternshipSubmission from "../models/internshipSubmissionModel.js";
import AuditLogModel from "../models/auditLogModel.js";

export const getInternshipSubmissions = async (req, res) => {
  try {
    const list = await InternshipSubmission.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch {
    res.status(500).json({ success: false, message: "Failed to load internships" });
  }
};

// @validation — status must be Approved or Rejected
export const updateInternshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Approved or Rejected",
      });
    }
    const doc = await InternshipSubmission.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }
    doc.status = status;
    await doc.save();

    await AuditLogModel.create({
      action: `INTERNSHIP_${status.toUpperCase()}`,
      target: `${doc.companyName} — ${doc.position}`,
      actor: req.adminId,
      metadata: { internshipId: doc._id },
    });

    res.status(200).json({ success: true, message: `Internship ${status.toLowerCase()}`, data: doc });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update internship" });
  }
};

/** Demo seed — creates sample rows if collection is empty */
export const seedInternshipSamples = async (req, res) => {
  try {
    const count = await InternshipSubmission.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: "Sample data already exists",
        data: { inserted: 0 },
      });
    }
    const samples = [
      {
        companyName: "TechNova Labs",
        position: "Software Engineering Intern",
        status: "Pending",
        category: "Technology",
      },
      {
        companyName: "Global Finance Ltd",
        position: "Data Analyst Intern",
        status: "Pending",
        category: "Finance",
      },
      {
        companyName: "Campus Media Group",
        position: "Marketing Intern",
        status: "Approved",
        category: "Marketing",
      },
    ];
    await InternshipSubmission.insertMany(samples);
    res.status(201).json({ success: true, message: "Sample internships added", data: { inserted: samples.length } });
  } catch {
    res.status(500).json({ success: false, message: "Failed to seed internships" });
  }
};
