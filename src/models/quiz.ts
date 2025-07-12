import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import AppBaseModel from "./_base";
import User from "./user";
import Question from "./question";
import Summary from "./summary";

@Entity()
class Quiz extends AppBaseModel {
    @Column({ type: "varchar", length: 255, nullable: false })
    title!: string;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @Column({ type: "bool", default: true, nullable: false })
    isActive!: boolean;

    @ManyToOne(() => User, (user) => user.createdQuizzes)
    instructor!: User;

    @OneToMany(() => Question, (question) => question.quiz)
    questions!: Question[];

    @OneToMany(() => Summary, (summary) => summary.quiz)
    summaries!: Summary[];
}

export default Quiz;