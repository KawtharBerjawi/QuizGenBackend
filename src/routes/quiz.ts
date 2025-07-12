import { Router } from "express";
import dto from "@/middlewares/dto/dto";
import { QuizIdParams } from "@/dtos/_general";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth/auth";
import { CreateQuizInputModel, UpdateQuizInputModel } from "@/dtos/quiz";
import { createQuiz, getAllQuizzes, getQuiz, updateQuiz, deleteQuiz } from "@/controllers/quiz";

const router = Router();

// Instructor routes
router.post("/", isAuthenticated, isAuthorized(["instructor"]), dto(CreateQuizInputModel), createQuiz);
router.put("/:quizId", isAuthenticated, isAuthorized(["instructor"]), dto(QuizIdParams, 'params'), dto(UpdateQuizInputModel), updateQuiz);
router.delete("/:quizId", isAuthenticated, isAuthorized(["instructor"]), dto(QuizIdParams, 'params'), deleteQuiz);

// Public routes
router.get("/", getAllQuizzes);
router.get("/:quizId", dto(QuizIdParams, 'params'), getQuiz);

export default router;