import NotificationModel from "../models/notificationModel.js";

const RECIPIENT_TYPES = ["All", "Student", "Company", "Supervisor"];
const PRIORITIES = ["Low", "Medium", "High"];

/**
 * POST /api/admin/notifications — create a notification record (broadcast metadata).
 */
export const createNotification = async (req, res) => {
  try {
    const { title, message, recipientType, priority } = req.body;

    // @validation — server-side mirrors client rules
    if (!title || String(title).trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be at least 5 characters",
      });
    }
    if (!message || String(message).trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be at least 10 characters",
      });
    }
    if (!recipientType || !RECIPIENT_TYPES.includes(recipientType)) {
      return res.status(400).json({
        success: false,
        message: "A valid recipient type is required",
      });
    }
    if (!priority || !PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "A valid priority is required",
      });
    }

    const doc = await NotificationModel.create({
      title: title.trim(),
      message: message.trim(),
      recipientType,
      priority,
      createdBy: String(req.adminId || "admin"),
    });

    res.status(201).json({
      success: true,
      message: "Notification saved successfully",
      data: doc,
    });
  } catch (error) {
    console.error("createNotification:", error);
    res.status(500).json({ success: false, message: "Failed to create notification" });
  }
};

/**
 * GET /api/admin/notifications — list all, newest first.
 * Optional query: recipientType, search (title contains, case-insensitive)
 */
export const getNotifications = async (req, res) => {
  try {
    const { recipientType, search } = req.query;
    const filter = {};

    if (recipientType && RECIPIENT_TYPES.includes(recipientType)) {
      filter.recipientType = recipientType;
    }
    if (search && String(search).trim()) {
      filter.title = { $regex: String(search).trim(), $options: "i" };
    }

    const list = await NotificationModel.find(filter).sort({ createdAt: -1 }).lean();

    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error("getNotifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};
