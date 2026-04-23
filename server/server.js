import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/Admin.route.js";
import readinessRouter from "./routes/readinessRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import portfolioRouter from "./routes/portfolioRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import vivaScheduleRouter from "./routes/vivaScheduleRoutes.js";
import { mountIntegrationApi } from "./routes/integrationApi.routes.js";

const app = express();

const port = process.env.PORT || 4000;

/** Allow any localhost / 127.0.0.1 port so Vite (5173, 5174, etc.) works with credentials. */
const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  const allowed =
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(origin) ||
    (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN);
  if (allowed) return callback(null, true);
  callback(null, false);
};

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/readiness", readinessRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/messages", messageRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/viva-schedule", vivaScheduleRouter);
mountIntegrationApi(app);

async function start() {
  await connectDB();
  app.listen(port, () =>
    console.log(`Server started on PORT:${port}
`)
  );
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
