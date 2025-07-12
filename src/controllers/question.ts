import { Response } from "express";
import { questionRepo, quizRepo } from "@/postgres/postgres";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { CustomRequest } from "@/types/general";
import { CreateQuestionInputModel, UpdateQuestionInputModel } from "@/dtos/question";
import { QuestionIdParams, QuizIdParams } from "@/dtos/_general";

// POST => /api/v1/quizzes/:quizId/questions
export const createQuestion = catchAsync(async (req: CustomRequest, res: Response) => {
    const { quizId } = req.params as unknown as QuizIdParams;
    const body = req.body as CreateQuestionInputModel;

    const quiz = await quizRepo.findOne({
        where: { id: quizId, instructor: { id: req.user.id } }
    });

    if (!quiz) throw new ErrorHandler("Quiz not found", 404);

    const question = await questionRepo.create({
        ...body,
        quiz,
        createdBy: req.user.userName,
        updatedBy: req.user.userName
    }).save();

    res.status(201).json({
        message: "Question created successfully",
        data: question
    });
});

// PUT => /api/v1/questions/:questionId
export const updateQuestion = catchAsync(async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params as unknown as QuestionIdParams;
    const body = req.body as UpdateQuestionInputModel;

    const question = await questionRepo.findOne({
        where: { id: questionId },
        relations: { quiz: { instructor: true } }
    });

    if (!question) throw new ErrorHandler("Question not found", 404);
    if (question.quiz.instructor.id !== req.user.id) {
        throw new ErrorHandler("Not authorized to update this question", 403);
    }

    Object.assign(question, body);
    question.updatedBy = req.user.userName;
    await question.save();

    res.status(200).json({
        message: "Question updated successfully",
        data: question
    });
});

// DELETE => /api/v1/questions/:questionId
export const deleteQuestion = catchAsync(async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params as unknown as QuestionIdParams;

    const question = await questionRepo.findOne({
        where: { id: questionId },
        relations: { quiz: { instructor: true } }
    });

    if (!question) throw new ErrorHandler("Question not found", 404);
    if (question.quiz.instructor.id !== req.user.id) {
        throw new ErrorHandler("Not authorized to delete this question", 403);
    }

    await questionRepo.delete(questionId);

    res.status(200).json({
        message: "Question deleted successfully"
    });
});