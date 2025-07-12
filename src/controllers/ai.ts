import { Response } from "express";
import { HF_TOKEN } from "@/constants/env";
import logger from "@/utils/logger/logger";
import { CustomRequest } from "@/types/general";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { InferenceClient } from "@huggingface/inference";
import { answerRepo, questionRepo, quizRepo } from "@/postgres/postgres";

const client = new InferenceClient(HF_TOKEN);

interface Quiz {
     title: string;
     questions: Question[];
}

interface Question {
     questionText: string;
     answers: Answer[];
}

interface Answer {
     answerText: string;
     isCorrect: boolean;
}

// Chat completion API
async function generateQuiz({ text }: { text: string }) {
     const out = await client.chatCompletion({
          provider: "novita",
          max_tokens: 2048,
          model: "deepseek-ai/DeepSeek-R1",
          messages: [{ role: "user", content: text }],
          tool_choice: { type: "function", function: { name: "generate_quiz" } },
          tools: [
               {
                    type: "function",
                    function: {
                         name: "generate_quiz",
                         description: "Generates a quiz with questions and answers",
                         parameters: {
                              type: "object",
                              properties: {
                                   title: {
                                        type: "string",
                                        description: "Title of the quiz",
                                   },
                                   questions: {
                                        type: "array",
                                        items: {
                                             type: "object",
                                             properties: {
                                                  questionText: {
                                                       type: "string",
                                                       description: "The text of the question",
                                                  },
                                                  answers: {
                                                       type: "array",
                                                       items: {
                                                            type: "object",
                                                            properties: {
                                                                 answerText: {
                                                                      type: "string",
                                                                      description: "The text of the answer",
                                                                 },
                                                                 isCorrect: {
                                                                      type: "boolean",
                                                                      description: "Whether this answer is correct",
                                                                 },
                                                            },
                                                            required: ["answerText", "isCorrect"],
                                                       },
                                                       minItems: 3,
                                                       maxItems: 3,
                                                       description: "Array of answers (exactly 3, one must be correct)",
                                                  },
                                             },
                                             required: ["questionText", "answers"],
                                        },
                                        minItems: 10,
                                        maxItems: 10,
                                        description: "Array of questions (exactly 10)",
                                   },
                              },
                              required: ["title", "questions"],
                         },
                    },
               },
          ],
     });

     const quizData = out.choices[0]?.message?.tool_calls?.[0]?.function?.arguments;

     if (quizData) {
          const quiz = JSON.parse(quizData);
          logger.info(quiz);
          return quiz as Quiz;
     } else {
          logger.info("No quiz data received");
          logger.info(out);
     }
}

// POST  /api/v1/ai/quiz
export const postQuiz = catchAsync(async (req: CustomRequest, res: Response) => {
     const { text } = req.body as { text: string };
     if (!text) return new ErrorHandler("Text is required", 400);
     const quiz = await generateQuiz({ text });
     if (!quiz) return new ErrorHandler("Failed to generate quiz", 500);

     // create quiz
     const createdQuiz = await quizRepo
          .create({
               title: quiz.title,
               createdBy: req.user.userName,
               updatedBy: req.user.userName,
               instructor: req.user,
          })
          .save();

     // create questions
     for (const question of quiz.questions) {
          const createdQuestion = await questionRepo
               .create({
                    text: question.questionText,
                    quiz: createdQuiz,
                    createdBy: req.user.userName,
                    updatedBy: req.user.userName,
               })
               .save();

          // create answers
          for (const answer of question.answers) {
               await answerRepo
                    .create({
                         text: answer.answerText,
                         question: createdQuestion,
                         isCorrect: answer.isCorrect,
                         createdBy: req.user.userName,
                         updatedBy: req.user.userName,
                    })
                    .save();
          }
     }

     res.status(201).json(createdQuiz);
});
