import logger from "@/utils/logger/logger";
import ErrorHandler from "@/utils/errors/errors";
import { Request, Response, NextFunction } from "express"
import { TokenExpiredError } from "jsonwebtoken";

export default (err: any, _req: Request, res: Response, _next: NextFunction) => {
     err.statusCode = err.statusCode || 500;

     if (err instanceof TokenExpiredError) {
          err = new ErrorHandler(("Session expired, please login again"), 401);
     }

     logger.error(err);
     res.status(err.statusCode).json({ message: err.message });
};