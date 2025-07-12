import { Router } from "express";
import dto from "@/middlewares/dto/dto";
import { QuizIdParams, QuestionIdParams } from "@/dtos/_general";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth/auth";
import { CreateQuestionInputModel, UpdateQuestionInputModel } from "@/dtos/question";
import { createQuestion, updateQuestion, deleteQuestion } from "@/controllers/question";

const router = Router();

router.post("/:quizId/questions", isAuthenticated, isAuthorized(["instructor"]), dto(QuizIdParams, 'params'), dto(CreateQuestionInputModel), createQuestion);
router.put("/questions/:questionId", isAuthenticated, isAuthorized(["instructor"]), dto(QuestionIdParams, 'params'), dto(UpdateQuestionInputModel), updateQuestion);
router.delete("/questions/:questionId", isAuthenticated, isAuthorized(["instructor"]), dto(QuestionIdParams, 'params'), deleteQuestion);

export default router;