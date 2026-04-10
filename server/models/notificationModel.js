import mongoose from "mongoose";

/**
 * Admin-broadcast notifications (USIMS).
 * recipientType: which audience the notification targets.
 */
const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    recipientType: {
      type: String,
      required: true,
      enum: ["All", "Student", "Company", "Supervisor"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const NotificationModel =
  mongoose.models.NotificationModel ||
  mongoose.model("NotificationModel", notificationSchema);

export default NotificationModel;
