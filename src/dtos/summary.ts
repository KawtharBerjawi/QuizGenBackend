import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateSummaryInputModel {
    @IsInt()
    @IsNotEmpty()
    correctAnswers!: number;

    @IsInt()
    @IsNotEmpty()
    totalQuestions!: number;
}

export class UpdateSummaryInputModel {
    @IsInt()
    @IsOptional()
    correctAnswers?: number;

    @IsInt()
    @IsOptional()
    totalQuestions?: number;
}