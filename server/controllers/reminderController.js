import Internship from "../models/Internship.js";
import Notification from "../models/Notification.js";

export const checkMissingReportsAndInactivity = async (req, res) => {
  try {
    const internships = await Internship.find({ status: "Active" });
    const today = new Date();

    for (const internship of internships) {
      const diffTime = today - new Date(internship.lastActivityDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        internship.inactivityAlert = true;
        internship.missingReports += 1;

        await Notification.create({
          student: internship.student,
          internship: internship._id,
          message: `No activity detected for internship "${internship.title}" for more than 7 days.`,
          type: "Inactivity",
        });

        await Notification.create({
          student: internship.student,
          internship: internship._id,
          message: `Missing report detected for internship "${internship.title}".`,
          type: "Missing Report",
        });
      } else if (diffDays >= 5) {
        await Notification.create({
          student: internship.student,
          internship: internship._id,
          message: `Reminder: Submit your report for internship "${internship.title}".`,
          type: "Reminder",
        });
      } else {
        internship.inactivityAlert = false;
      }

      await internship.save();
    }

    res.json({
      success: true,
      message: "Reminder and alert check completed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};