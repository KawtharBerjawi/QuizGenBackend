import { IsString, IsNotEmpty, IsBoolean, IsOptional } from "class-validator";

export class CreateAnswerInputModel {
    @IsString()
    @IsNotEmpty()
    text!: string;

    @IsBoolean()
    @IsNotEmpty()
    isCorrect!: boolean;
}

export class UpdateAnswerInputModel {
    @IsString()
    @IsOptional()
    text?: string;

    @IsBoolean()
    @IsOptional()
    isCorrect?: boolean;
}