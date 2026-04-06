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
