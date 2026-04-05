import express from "express";
import {
  registerCompany,
  loginCompany,
  logoutCompany,
} from "../controllers/companyAuthController.js";

const companyAuthRouter = express.Router();

companyAuthRouter.post("/register", registerCompany);
companyAuthRouter.post("/login", loginCompany);
companyAuthRouter.post("/logout", logoutCompany);

export default companyAuthRouter;