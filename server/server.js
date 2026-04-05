import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/Admin.route.js";
import companyAuthRouter from "./routes/companyAuthRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import internshipRouter from "./routes/internshipRoutes.js";
import internshipMonitoringRouter from "./routes/internshipMonitoringRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import issueRouter from "./routes/issueRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import reminderRouter from "./routes/reminderRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => res.send("API working"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/company-auth", companyAuthRouter);
app.use("/api/company", companyRouter);
app.use("/api/internships", internshipRouter);
app.use("/api/reports", reportRouter);
app.use("/api/issues", issueRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/reminders", reminderRouter);
app.use("/api/internship-monitoring", internshipMonitoringRouter);

app.listen(port, () => console.log(`Server started on PORT:${port}`));