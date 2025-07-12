import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import AppBaseModel from "./_base";
import Quiz from "./quiz";
import Answer from "./answer";

@Entity()
class Question extends AppBaseModel {
    @Column({ type: "text", nullable: false })
    text!: string;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    quiz!: Quiz;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers!: Answer[];
}

export default Question;