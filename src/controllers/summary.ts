import { Response } from "express";
import { summaryRepo, quizRepo } from "@/postgres/postgres";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { CustomRequest } from "@/types/general";
import { SubmitQuizInputModel } from "@/dtos/quiz";
import { QuizIdParams } from "@/dtos/_general";
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

interface QuizFeedbackParams {
     quizTitle: string;
     correctAnswers: number;
     totalQuestions: number;
     studentName: string;
}

export async function generateQuizFeedback({ quizTitle, correctAnswers, totalQuestions, studentName }: QuizFeedbackParams): Promise<string> {
     const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
     const performanceLevel = scorePercentage >= 80 ? "excellent" : scorePercentage >= 60 ? "good" : "needs improvement";

     try {
          const response = await client.chatCompletion({
               provider: "novita",
               model: "deepseek-ai/DeepSeek-R1",
               messages: [
                    {
                         role: "user",
                         content: `Generate feedback in English only for a student who scored ${correctAnswers}/${totalQuestions} on the "${quizTitle}" quiz.`,
                    },
               ],
               tool_choice: { type: "function", function: { name: "generate_feedback" } },
               tools: [
                    {
                         type: "function",
                         function: {
                              name: "generate_feedback",
                              description: "Generates personalized quiz feedback in English for a student",
                              parameters: {
                                   type: "object",
                                   properties: {
                                        feedbackText: {
                                             type: "string",
                                             description:
                                                  "The feedback text in English to show the student, including score, performance assessment, and improvement suggestions",
                                        },
                                   },
                                   required: ["feedbackText"],
                              },
                         },
                    },
               ],
               max_tokens: 200,
               temperature: 0.7,
          });

          const toolCall = response.choices[0]?.message?.tool_calls?.[0];
          if (!toolCall) {
               throw new Error("No tool call in response");
          }

          // Safely parse JSON with error handling
          let feedbackData;
          try {
               feedbackData = JSON.parse(toolCall.function.arguments);
          } catch (parseError) {
               console.error("JSON parse error:", parseError);
               throw new Error("Failed to parse feedback response");
          }

          if (!feedbackData?.feedbackText) {
               throw new Error("Invalid feedback format");
          }

          return feedbackData.feedbackText;
     } catch (error) {
          console.error("AI feedback generation failed:", error);
          // Fallback in English
          return (
               `${studentName ? `Hi ${studentName}! ` : ""}You scored ${correctAnswers}/${totalQuestions} on "${quizTitle}". ` +
               `Your performance is ${performanceLevel}. ` +
               `Suggested resource: [Microsoft Learn](https://learn.microsoft.com)`
          );
     }
}

// POST => /api/v1/quizzes/:quizId/submit
// POST => /api/v1/quizzes/:quizId/submit
export const submitQuiz = catchAsync(async (req: CustomRequest, res: Response) => {
     const { quizId } = req.params as unknown as QuizIdParams;
     const { answers } = req.body as SubmitQuizInputModel;

     const quiz = await quizRepo.findOne({
          where: { id: quizId, isActive: true },
          relations: { questions: { answers: true } },
     });

     if (!quiz) throw new ErrorHandler("Quiz not found", 404);

     // Calculate score
     let correctAnswers = 0;
     const totalQuestions = quiz.questions.length;

     for (const question of quiz.questions) {
          const userAnswer = answers.find((a) => a.questionId === question.id);
          if (!userAnswer) continue;

          const correctAnswer = question.answers.find((a) => a.isCorrect);
          if (correctAnswer && userAnswer.answerId === correctAnswer.id) {
               correctAnswers++;
          }
     }

     try {
          // Generate AI feedback using the tool-based approach
          const feedbackMessage = await generateQuizFeedback({
               quizTitle: quiz.title,
               correctAnswers,
               totalQuestions,
               studentName: req.user.firstName,
          });

          // Create summary
          await summaryRepo
               .create({
                    correctAnswers,
                    totalQuestions,
                    quiz,
                    student: req.user,
                    createdBy: req.user.userName,
                    updatedBy: req.user.userName,
               })
               .save();

          // Return both score and the clean feedback message
          res.status(201).json({
               success: true,
               score: `${correctAnswers}/${totalQuestions}`,
               percentage: Math.round((correctAnswers / totalQuestions) * 100),
               feedbackMessage,
          });
     } catch (error) {
          // Fallback response if AI fails
          const percentage = Math.round((correctAnswers / totalQuestions) * 100);
          const fallbackFeedback = `${
               req.user.firstName ? `Hi ${req.user.firstName}! ` : ""
          }You scored ${correctAnswers}/${totalQuestions} (${percentage}%) on "${quiz.title}".`;

          await summaryRepo
               .create({
                    correctAnswers,
                    totalQuestions,
                    quiz,
                    student: req.user,
                    createdBy: req.user.userName,
                    updatedBy: req.user.userName,
               })
               .save();

          res.status(201).json({
               success: true,
               score: `${correctAnswers}/${totalQuestions}`,
               percentage,
               fallbackFeedback,
          });
     }
});
// GET => /api/v1/quizzes/:quizId/summaries
export const getQuizSummaries = catchAsync(async (req: CustomRequest, res: Response) => {
     const { quizId } = req.params as unknown as QuizIdParams;

     const quiz = await quizRepo.findOne({
          where: { id: quizId, instructor: { id: req.user.id } },
     });

     if (!quiz) throw new ErrorHandler("Quiz not found", 404);

     const summaries = await summaryRepo.find({
          where: { quiz: { id: quizId } },
          relations: { student: true },
     });

     res.status(200).json({
          message: "Summaries retrieved successfully",
          data: summaries,
     });
});

// GET => /api/v1/users/summaries
export const getUserSummaries = catchAsync(async (req: CustomRequest, res: Response) => {
     const summaries = await summaryRepo.find({
          where: { student: { id: req.user.id } },
          relations: { quiz: { instructor: true } },
     });

     res.status(200).json({
          message: "Summaries retrieved successfully",
          data: summaries,
     });
});
