import User from "@/models/user";
import Quiz from "@/models/quiz";
import Question from "@/models/question";
import Answer from "@/models/answer";
import Summary from "@/models/summary";
import { DataSource } from "typeorm";
import { POSTGRES_HOST, POSTGRES_NAME, POSTGRES_PASS, POSTGRES_PORT, POSTGRES_USER } from "@/constants/env";

const db = new DataSource({
     type: "postgres",
     host: POSTGRES_HOST,
     port: POSTGRES_PORT,
     username: POSTGRES_USER,
     password: POSTGRES_PASS,
     database: POSTGRES_NAME,
     entities: [User, Quiz, Question, Answer, Summary],
     synchronize: true,
});

export const userRepo = db.getRepository(User);
export const quizRepo = db.getRepository(Quiz);
export const questionRepo = db.getRepository(Question);
export const answerRepo = db.getRepository(Answer);
export const summaryRepo = db.getRepository(Summary);

export default db;