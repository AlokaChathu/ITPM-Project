import Internship from '../models/Internship.js';
import Report from '../models/Report.js';
import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';

export const getDashboardData = async (req, res) => {
  try {
    const internships = await Internship.find({ student: req.userId });
    const reports = await Report.find({ student: req.userId });
    const issues = await Issue.find({ student: req.userId });
    const Notification = await Notification.find({ student: req.userId }).sort({ createdAt: -1});

    const totalInternships = internships.length;
    const activeInternships = internships.filter(i => i.status === 'Active').length;
    const completedInternships = internships.filter(i => i.status === 'Completed').length;
    const totalReports = reports.length;
    const openIssues = issues.filter(i => i.status === 'Open').length;

    const alerts = internships
      .filter(i => i.missingReports > 0 || i.inactivityAlert)
      .map(i => ({
        internshipId: i._id,
        title: i.title,
        missingReports: i.missingReports,
        inactivityAlert: i.inactivityAlert,
      }));

    res.json({
      success: true,
      dashboard: {
        totalInternships,
        activeInternships,
        completedInternships,
        totalReports,
        openIssues,
        alerts,
        Notification,
        internships,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};