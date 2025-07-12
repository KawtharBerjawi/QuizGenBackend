import { IsOptional, IsString, IsEnum, IsArray, ArrayNotEmpty, ArrayMinSize, IsNumberString, IsUUID, IsBooleanString } from "class-validator";

export class GetAllRecordQuery {
     @IsNumberString()
     page!: string;

     @IsNumberString()
     pageSize!: string;

     @IsString()
     @IsOptional()
     searchTerm?: string;

     @IsString()
     sortBy!: string;

     @IsEnum(["asc", "desc"], { message: ("Sorting should be either asc ort desc") })
     sortDir!: string;

     @IsString()
     @IsOptional()
     select?: string;

     @IsBooleanString()
     @IsOptional()
     isDeleted?: boolean;
}

export class UUIDParam {
     @IsUUID()
     id!: string;
}

export class BulkActionInputModel {
     @IsArray()
     @ArrayNotEmpty({ message: () => ("IDs array cannot be empty") })
     @ArrayMinSize(1, { message: () => ("IDs array cannot be empty") })
     @IsUUID("all", { each: true })
     ids!: string[]
}

export class QuizIdParams {
     @IsUUID()
     quizId!: string;
}

export class QuestionIdParams {
     @IsUUID()
     questionId!: string;
}

export class AnswerIdParams {
     @IsUUID()
     answerId!: string;
}