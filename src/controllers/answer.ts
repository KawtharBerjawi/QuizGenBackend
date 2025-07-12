import { Response } from "express";
import { CustomRequest } from "@/types/general";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { answerRepo, questionRepo } from "@/postgres/postgres";
import { AnswerIdParams, QuestionIdParams } from "@/dtos/_general";
import { CreateAnswerInputModel, UpdateAnswerInputModel } from "@/dtos/answer";

// POST => /api/v1/questions/:questionId/answers
export const createAnswer = catchAsync(async (req: CustomRequest, res: Response) => {
    const { questionId } = req.params as unknown as QuestionIdParams;
    const body = req.body as CreateAnswerInputModel;

    const question = await questionRepo.findOne({
        where: { id: questionId },
        relations: { quiz: { instructor: true } }
    });

    if (!question) throw new ErrorHandler("Question not found", 404);
    if (question.quiz.instructor.id !== req.user.id) {
        throw new ErrorHandler("Not authorized to add answers to this question", 403);
    }

    const answer = await answerRepo.create({
        ...body,
        question,
        createdBy: req.user.userName,
        updatedBy: req.user.userName
    }).save();

    res.status(201).json({
        message: "Answer created successfully",
        data: answer
    });
});

// PUT => /api/v1/answers/:answerId
export const updateAnswer = catchAsync(async (req: CustomRequest, res: Response) => {
    const { answerId } = req.params as unknown as AnswerIdParams;
    const body = req.body as UpdateAnswerInputModel;

    const answer = await answerRepo.findOne({
        where: { id: answerId },
        relations: { question: { quiz: { instructor: true } } }
    });

    if (!answer) throw new ErrorHandler("Answer not found", 404);
    if (answer.question.quiz.instructor.id !== req.user.id) {
        throw new ErrorHandler("Not authorized to update this answer", 403);
    }

    Object.assign(answer, body);
    answer.updatedBy = req.user.userName;
    await answer.save();

    res.status(200).json({
        message: "Answer updated successfully",
        data: answer
    });
});

// DELETE => /api/v1/answers/:answerId
export const deleteAnswer = catchAsync(async (req: CustomRequest, res: Response) => {
    const { answerId } = req.params as unknown as AnswerIdParams;

    const answer = await answerRepo.findOne({
        where: { id: answerId },
        relations: { question: { quiz: { instructor: true } } }
    });

    if (!answer) throw new ErrorHandler("Answer not found", 404);
    if (answer.question.quiz.instructor.id !== req.user.id) {
        throw new ErrorHandler("Not authorized to delete this answer", 403);
    }

    await answerRepo.delete(answerId);

    res.status(200).json({
        message: "Answer deleted successfully"
    });
});