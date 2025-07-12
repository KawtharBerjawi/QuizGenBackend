import { validate } from "class-validator";
import ErrorHandler from "@/utils/errors/errors";
import { plainToInstance } from "class-transformer";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { Response, Request, NextFunction } from "express";
import { getErrorMessage } from "@/utils/functions/functions";

const dto = (dto: any, object: "body" | "query" | "params" | "headers" = "body") =>
     catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
          const errors = await validate(plainToInstance(dto, req[object]), {
               whitelist: true,
               forbidNonWhitelisted: true,
          });

          if (errors.length > 0) {
               const errorKey = getErrorMessage(errors);
               return next(new ErrorHandler((errorKey), 400));
          }

          next();
     });

export default dto;