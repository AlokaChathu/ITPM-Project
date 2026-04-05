import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createInternshipMonitoring,
  getMyInternshipMonitoring,
  getSingleInternshipMonitoring,
  updateInternshipMonitoring,
  deleteInternshipMonitoring,
} from "../controllers/internshipMonitoringController.js";

const router = express.Router();

router.post("/", userAuth, createInternshipMonitoring);
router.get("/my", userAuth, getMyInternshipMonitoring);
router.get("/:id", userAuth, getSingleInternshipMonitoring);
router.put("/:id", userAuth, updateInternshipMonitoring);
router.delete("/:id", userAuth, deleteInternshipMonitoring);

export default router;