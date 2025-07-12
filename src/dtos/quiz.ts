import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateQuizInputModel {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateQuizInputModel {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class SubmitQuizInputModel {
    @IsNotEmpty()
    answers!: {
        questionId: string;
        answerId: string;
    }[];
}