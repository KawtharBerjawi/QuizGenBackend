import { Response, Request } from "express";
import { quizRepo } from "@/postgres/postgres";
import { QuizIdParams } from "@/dtos/_general";
import { CustomRequest } from "@/types/general";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { CreateQuizInputModel, UpdateQuizInputModel } from "@/dtos/quiz";

// POST => /api/v1/quizzes
export const createQuiz = catchAsync(async (req: CustomRequest, res: Response) => {
    const body = req.body as CreateQuizInputModel;

    const quiz = await quizRepo.create({
        ...body,
        instructor: req.user,
        createdBy: req.user.userName,
        updatedBy: req.user.userName
    }).save();

    res.status(201).json({
        message: "Quiz created successfully",
        data: quiz
    });
});

// GET => /api/v1/quizzes
export const getAllQuizzes = catchAsync(async (_req: Request, res: Response) => {
    const quizzes = await quizRepo.find({
        where: { isActive: true },
        relations: { questions: { answers: true } }
    });

    res.status(200).json({
        message: "Quizzes retrieved successfully",
        data: quizzes
    });
});

// GET => /api/v1/quizzes/:quizId
export const getQuiz = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params as unknown as QuizIdParams;

    const quiz = await quizRepo.findOne({
        where: { id: quizId, isActive: true },
        relations: { questions: { answers: true } }
    });

    if (!quiz) throw new ErrorHandler("Quiz not found", 404);

    res.status(200).json({
        message: "Quiz retrieved successfully",
        data: quiz
    });
});

// PUT => /api/v1/quizzes/:quizId
export const updateQuiz = catchAsync(async (req: CustomRequest, res: Response) => {
    const { quizId } = req.params as unknown as QuizIdParams;
    const body = req.body as UpdateQuizInputModel;

    const quiz = await quizRepo.findOne({
        where: { id: quizId, instructor: { id: req.user.id } }
    });

    if (!quiz) throw new ErrorHandler("Quiz not found", 404);

    Object.assign(quiz, body);
    quiz.updatedBy = req.user.userName;
    await quiz.save();

    res.status(200).json({
        message: "Quiz updated successfully",
        data: quiz
    });
});

// DELETE => /api/v1/quizzes/:quizId
export const deleteQuiz = catchAsync(async (req: CustomRequest, res: Response) => {
    const { quizId } = req.params as unknown as QuizIdParams;

    const quiz = await quizRepo.findOne({
        where: { id: quizId, instructor: { id: req.user.id } }
    });

    if (!quiz) throw new ErrorHandler("Quiz not found", 404);

    quiz.isActive = false;
    quiz.updatedBy = req.user.userName;
    await quiz.save();

    res.status(200).json({
        message: "Quiz deleted successfully"
    });
});