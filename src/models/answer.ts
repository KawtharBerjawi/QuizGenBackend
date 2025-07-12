import { Entity, Column, ManyToOne } from "typeorm";
import AppBaseModel from "./_base";
import Question from "./question";

@Entity()
class Answer extends AppBaseModel {
    @Column({ type: "text", nullable: false })
    text!: string;

    @Column({ type: "bool", default: false, nullable: false })
    isCorrect!: boolean;

    @ManyToOne(() => Question, (question) => question.answers)
    question!: Question;
}

export default Answer;