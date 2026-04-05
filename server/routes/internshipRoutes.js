import express from "express";
import companyAuth from "../middleware/companyAuth.js";
import {
  createInternship,
  getCompanyInternships,
  getSingleInternship,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipController.js";

const router = express.Router();

router.post("/", companyAuth, createInternship);
router.get("/", companyAuth, getCompanyInternships);
router.get("/:id", companyAuth, getSingleInternship);
router.put("/:id", companyAuth, updateInternship);
router.delete("/:id", companyAuth, deleteInternship);

export default router;