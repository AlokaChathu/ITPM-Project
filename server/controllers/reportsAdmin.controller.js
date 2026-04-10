import userModel from "../models/userModel.js";
import InternshipSubmission from "../models/internshipSubmissionModel.js";

function toCsv(rows, headers) {
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map(esc).join(","));
  }
  return lines.join("\n");
}

export const getStudentReportCsv = async (req, res) => {
  try {
    const users = await userModel
      .find({ isDeleted: false, role: "Student" })
      .select("name email role status createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const headers = ["Name", "Email", "Role", "Status", "Registered"];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.role,
      u.status,
      u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "",
    ]);
    const csv = toCsv(rows, headers);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="student-report.csv"');
    res.status(200).send("\uFEFF" + csv);
  } catch {
    res.status(500).json({ success: false, message: "Failed to build student report" });
  }
};

export const getInternshipReportCsv = async (req, res) => {
  try {
    const list = await InternshipSubmission.find({}).sort({ createdAt: -1 }).lean();
    const headers = ["Company Name", "Position", "Status", "Submitted"];
    const rows = list.map((i) => [
      i.companyName,
      i.position,
      i.status,
      i.createdAt ? new Date(i.createdAt).toISOString().slice(0, 10) : "",
    ]);
    const csv = toCsv(rows, headers);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="internship-report.csv"');
    res.status(200).send("\uFEFF" + csv);
  } catch {
    res.status(500).json({ success: false, message: "Failed to build internship report" });
  }
};

/** Plain JSON for client-side PDF / print */
export const getReportsJson = async (req, res) => {
  try {
    const students = await userModel
      .find({ isDeleted: false, role: "Student" })
      .select("name email status")
      .lean();
    const internships = await InternshipSubmission.find({}).select("companyName position status").lean();
    res.status(200).json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        students,
        internships,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: "Failed to load report data" });
  }
};
