import express from "express";
import userAuth from "../middleware/userAuth.js";
import { submitReport, getMyReports } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", userAuth, submitReport);
router.get("/my", userAuth, getMyReports);

export default router;