import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  submitReport,
  getMyReports,
  updateReport,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", userAuth, submitReport);
router.get("/my", userAuth, getMyReports);
router.put("/:id", userAuth, updateReport);
router.delete("/:id", userAuth, deleteReport);

export default router;