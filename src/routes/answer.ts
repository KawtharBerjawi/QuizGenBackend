import { Router } from "express";
import dto from "@/middlewares/dto/dto";
import { QuestionIdParams, AnswerIdParams } from "@/dtos/_general";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth/auth";
import { CreateAnswerInputModel, UpdateAnswerInputModel } from "@/dtos/answer";
import { createAnswer, updateAnswer, deleteAnswer } from "@/controllers/answer";

const router = Router();

router.post("/questions/:questionId/answers", isAuthenticated, isAuthorized(["instructor"]), dto(QuestionIdParams, 'params'), dto(CreateAnswerInputModel), createAnswer);
router.put("/answers/:answerId", isAuthenticated, isAuthorized(["instructor"]), dto(AnswerIdParams, 'params'), dto(UpdateAnswerInputModel), updateAnswer);
router.delete("/answers/:answerId", isAuthenticated, isAuthorized(["instructor"]), dto(AnswerIdParams, 'params'), deleteAnswer);

export default router;