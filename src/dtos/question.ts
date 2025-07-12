import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateQuestionInputModel {
    @IsString()
    @IsNotEmpty()
    text!: string;
}

export class UpdateQuestionInputModel {
    @IsString()
    @IsOptional()
    text?: string;
}