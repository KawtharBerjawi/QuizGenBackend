import { userRepo } from "@/postgres/postgres";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "@/types/general";
import { Response, NextFunction } from "express";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { COOKIE_NAME, JWT_SECRET } from "@/constants/env";
import { checkUserValidity } from "@/utils/functions/functions";

export const isAuthenticated = catchAsync(async (req: CustomRequest, _res: Response, next: NextFunction) => {
     const token = req.cookies[COOKIE_NAME];
     if (!token) return next(new ErrorHandler(("User is not authenticated"), 401));
     const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
     const user = await userRepo.findOne({ where: { id: decodedToken.id! } })
     if (!user) return next(new ErrorHandler(("User not found"), 404));
     req.user = user;
     next();
});

export const isAuthorized = (roles: ("instructor" | "student")[]) =>
     catchAsync(async (req: CustomRequest, _res: Response, next: NextFunction) => {
          checkUserValidity(req.user)
          if (!roles.includes(req.user.role)) return next(new ErrorHandler(("User is forbidden to perform this action"), 403));
          next();
     });