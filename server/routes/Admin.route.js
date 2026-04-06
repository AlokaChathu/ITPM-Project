import express from "express";
import { adminRegister, loginAdmin, logout, verifyAdmin } from "../controllers/Admin.controller.js";
import {
  addAdminUser,
  createBackup,
  deleteAdminUser,
  getAdminConfig,
  getAdminDashboard,
  getAdminUsers,
  getBackupStatus,
  getRoles,
  patchAdminUser,
  restoreBackup,
  upsertAdminConfig,
} from "../controllers/adminModule.controller.js";
import {
  getInternshipSubmissions,
  updateInternshipStatus,
} from "../controllers/internshipAdmin.controller.js";
import {
  getStudentReportCsv,
  getInternshipReportCsv,
  getReportsJson,
} from "../controllers/reportsAdmin.controller.js";
import { createNotification, getNotifications } from "../controllers/notificationController.js";
import adminAuth from "../middleware/AdminAuth.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", loginAdmin);
router.get("/logout", adminAuth, logout);
router.get("/verify", adminAuth, verifyAdmin);

router.get("/dashboard", adminAuth, getAdminDashboard);

router.get("/users", adminAuth, getAdminUsers);
router.post("/users", adminAuth, addAdminUser);
router.patch("/users/:id", adminAuth, patchAdminUser);
router.delete("/users/:id", adminAuth, deleteAdminUser);

router.get("/roles", adminAuth, getRoles);
router.patch("/roles/:id", adminAuth, patchAdminUser);

router.get("/config", adminAuth, getAdminConfig);
router.post("/config", adminAuth, upsertAdminConfig);

router.get("/backup", adminAuth, getBackupStatus);
router.post("/backup", adminAuth, createBackup);
router.post("/backup/restore", adminAuth, restoreBackup);

router.get("/internships", adminAuth, getInternshipSubmissions);
router.patch("/internships/:id", adminAuth, updateInternshipStatus);

router.get("/reports/students.csv", adminAuth, getStudentReportCsv);
router.get("/reports/internships.csv", adminAuth, getInternshipReportCsv);
router.get("/reports/json", adminAuth, getReportsJson);

router.get("/notifications", adminAuth, getNotifications);
router.post("/notifications", adminAuth, createNotification);

export default router;
