import { Entity, Column, ManyToOne } from "typeorm";
import AppBaseModel from "./_base";
import Quiz from "./quiz";
import User from "./user";

@Entity()
class Summary extends AppBaseModel {
     @Column({ type: "int", nullable: false })
     correctAnswers!: number;

     @Column({ type: "int", nullable: false })
     totalQuestions!: number;

     @ManyToOne(() => Quiz, (quiz) => quiz.summaries)
     quiz!: Quiz;

     @ManyToOne(() => User, (user) => user.quizSummaries)
     student!: User;
}

export default Summary;
