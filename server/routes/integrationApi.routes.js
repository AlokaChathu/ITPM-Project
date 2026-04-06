import express from "express";
import adminAuth from "../middleware/AdminAuth.js";
import {
  addAdminUser,
  deleteAdminUser,
  getAdminConfig,
  getAdminDashboard,
  getAdminUsers,
  getRoles,
  patchAdminUser,
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
import { getAdminAnalytics } from "../controllers/analyticsAdmin.controller.js";

const router = express.Router();

router.use(adminAuth);

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAdminUsers);
router.post("/users", addAdminUser);
router.patch("/users/:id", patchAdminUser);
router.delete("/users/:id", deleteAdminUser);

router.get("/roles", getRoles);
router.patch("/roles/:id", patchAdminUser);

router.get("/config", getAdminConfig);
router.post("/config", upsertAdminConfig);

router.get("/internships", getInternshipSubmissions);
router.patch("/internships/:id", updateInternshipStatus);

router.get("/analytics", getAdminAnalytics);

router.get("/reports", getReportsJson);
router.get("/reports/students.csv", getStudentReportCsv);
router.get("/reports/internships.csv", getInternshipReportCsv);
router.get("/reports/json", getReportsJson);

/**
 * Mount integration REST surface for other modules: /api/users, /api/config, etc.
 * Register after /api/user and /api/admin so those prefixes stay distinct.
 */
export function mountIntegrationApi(app) {
  app.use("/api", router);
}
