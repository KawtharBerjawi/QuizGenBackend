import { Router } from "express";
import dto from "@/middlewares/dto/dto";
import { QuizIdParams } from "@/dtos/_general";
import { SubmitQuizInputModel } from "@/dtos/quiz";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth/auth";
import { submitQuiz, getQuizSummaries, getUserSummaries } from "@/controllers/summary";

const router = Router();

// Student routes
router.post("/submit/:quizId", isAuthenticated, isAuthorized(["student"]), dto(QuizIdParams, 'params'), dto(SubmitQuizInputModel), submitQuiz);
router.get("/users/summaries", isAuthenticated, isAuthorized(["student"]), getUserSummaries);

// Instructor routes
router.get("/quizzes/:quizId/summaries", isAuthenticated, isAuthorized(["instructor"]), dto(QuizIdParams, 'params'), getQuizSummaries);

export default router;