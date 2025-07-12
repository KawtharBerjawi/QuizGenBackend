import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "@/constants/env";
import morganLogger from "@/middlewares/morgan/morgan";
import errorMiddleware from "@/middlewares/errors/error";

// routes
import authRouter from "@/routes/auth";
import quizRouter from "@/routes/quiz";
import questionRouter from "@/routes/question";
import answerRouter from "@/routes/answer";
import summaryRouter from "@/routes/summary";
import aiRouter from "@/routes/ai";

// initialize express app
const app = express();

// third party middlewares
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));
app.use(cookieParser());
app.use(morganLogger);

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/quizzes", quizRouter);
app.use("/api/v1/quizzes", questionRouter);
app.use("/api/v1/quizzes", answerRouter);
app.use("/api/v1", summaryRouter);
app.use("/api/v1/ai", aiRouter);

// append error middleware for handling http error
app.use(errorMiddleware);

export default app;