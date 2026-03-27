import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from './routes/Admin.route.js'
import readinessRouter from "./routes/readinessRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import portfolioRouter from "./routes/portfolioRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

// API Endpoint 
app.get("/",(req,res)=>res.send("API working"));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/readiness', readinessRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/messages', messageRouter);

app.listen(port,()=>console.log(`Server started on PORT:${port}
`));
