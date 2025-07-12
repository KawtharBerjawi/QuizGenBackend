import crypto from "crypto";
import { MoreThan } from "typeorm";
import { sendToken } from "@/utils/jwt/jwt";
import { Response, Request } from "express";
import { COOKIE_NAME } from "@/constants/env";
import { userRepo } from "@/postgres/postgres";
import { CustomRequest } from "@/types/general";
import ErrorHandler from "@/utils/errors/errors";
import catchAsync from "@/utils/catchAsync/catchAsync";
import { checkUserValidity, sendPasswordResetEmail, sendVerificationEmail } from "@/utils/functions/functions";
import {
     RegisterInputModel,
     EmailVerificationInputModel,
     VerifyEmailParams,
     ForgetPasswordInputModel,
     LoginInputModel,
     ResetPasswordInputModel,
     ResetPasswordParams,
     UpdateUserInfoInputModel,
     UpdatePasswordInputModel,
} from "@/dtos/auth";

// POST  => /api/v1/auth/register
export const register = catchAsync(async (req: Request, res: Response) => {
     // retrieve user input
     const body = req.body as RegisterInputModel;

     // create the user
     const user = await userRepo.create({ ...body, role: "student", createdBy: "system", updatedBy: "system" }).save();

     // send verification email
     await sendVerificationEmail(user, user.email);

     // logout user when email is mutated, and send email for email verification link
     res.status(201).json({ message: "user registered successfully" });
});

// POST  => /api/v1/auth/login
export const login = catchAsync(async (req: Request, res: Response) => {
     // retrieve user input
     const { email, password } = req.body as LoginInputModel;

     // get user from db
     const user = await userRepo.findOne({ where: { email } });

     // check if user exists
     checkUserValidity(user);

     // compare passwords
     const isPasswordMatches = await user!.comparePassword(password);

     // check if passwords matches
     if (!isPasswordMatches) throw new ErrorHandler("Incorrect password", 400);

     // return logged in response
     sendToken(user!.id, 201, res);
});

// GET  => /api/v1/auth/logout
export const logout = catchAsync(async (_req: CustomRequest, res: Response) => {
     res.status(200).clearCookie(COOKIE_NAME).json({ message: "Logged out successfully" });
});

// GET  => /api/v1/auth/loggedUser
export const loggedUser = catchAsync(async (req: CustomRequest, res: Response) => {
     res.status(200).json(req.user);
});

// GET  => /api/v1/auth/forgetPassword
export const forgetPassword = catchAsync(async (req: Request, res: Response) => {
     // retrieve email from user input
     const { email } = req.body as ForgetPasswordInputModel;

     // get the user with that email
     const user = await userRepo.findOne({ where: { email } });

     // check if user with such email is registered in the database
     checkUserValidity(user);

     // send email with reset password url
     await sendPasswordResetEmail(user!, email);

     res.status(200).json({ message: "Check your email for password reset token" });
});

// GET => /api/v1/emailVerification
export const emailVerificationRequest = catchAsync(async (req: Request, res: Response) => {
     // retrieve email from user input
     const { email } = req.body as EmailVerificationInputModel;

     // get the user with that email
     const user = await userRepo.findOne({ where: { email } });

     if (!user) throw new ErrorHandler("User not found", 404);

     if (!user.isActivated) throw new ErrorHandler("User account is deactivated", 403);

     // send verification email
     await sendVerificationEmail(user!, email);

     res.status(201).json({ message: "Check your email for verification" });
});

// PUT  => /api/v1/auth/resetPassword/:token
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
     // get token from params
     const { token } = req.params as unknown as ResetPasswordParams;

     // hash the token in the url
     const passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");

     // get current time
     const currentTimeStamp = new Date(Date.now());

     // get the user based on token, token expiry
     const user = await userRepo.findOne({
          where: { passwordResetToken, passwordResetExpiry: MoreThan(currentTimeStamp) },
     });

     // check if user exists
     checkUserValidity(user);

     // retrieve user input
     const { password, confirmPassword } = req.body as ResetPasswordInputModel;

     // check if passwords are equal
     if (password !== confirmPassword) throw new ErrorHandler("Passwords do not matches", 400);

     // update the user
     user!.password = password;
     user!.passwordResetToken = null;
     user!.passwordResetExpiry = null;
     user!.updatedBy = user!.userName;
     await user!.save();

     res.status(200).json({ message: "Password updated successfully" });
});

// PUT  => /api/v1/auth/emailVerification/:token
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
     // get token from params
     const { token } = req.params as unknown as VerifyEmailParams;

     // hash the token in the url
     const emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");

     // get current time
     const currentTimeStamp = new Date(Date.now());

     // get the user based on token, token expiry
     const user = await userRepo.findOne({
          where: { emailVerificationToken, emailVerificationExpiry: MoreThan(currentTimeStamp) },
     });

     if (!user) throw new ErrorHandler("User not found", 404);

     if (!user.isActivated) throw new ErrorHandler("User account is deactivated", 403);

     // update the user
     user!.isVerified = true;
     user!.emailVerificationToken = null;
     user!.emailVerificationExpiry = null;
     user!.updatedBy = user!.userName;
     await user!.save();

     res.status(200).json({ message: "Email verified successfully" });
});

// PUT  => /api/v1/auth/password
export const updatePassword = catchAsync(async (req: CustomRequest, res: Response) => {
     // retrieve user input
     const { oldPassword, newPassword, confirmPassword } = req.body as UpdatePasswordInputModel;

     // check if old password is correct
     const isOldPasswordValid = await req.user.comparePassword(oldPassword);

     // if no will return error
     if (!isOldPasswordValid) throw new ErrorHandler("Incorrect password", 400);

     // check if new password and confirm password matches
     if (newPassword !== confirmPassword) throw new ErrorHandler("Passwords do not matches", 400);

     // update user
     req.user.password = newPassword;
     req.user.updatedBy = req.user.userName;
     await req.user.save();

     res.status(200).json({ message: "Password updated successfully" });
});

// PUT  => /api/v1/auth/accountInformation
export const updateInformation = catchAsync(async (req: CustomRequest, res: Response) => {
     // retrieve user input
     const { email, firstName, lastName, phoneNumber } = req.body as UpdateUserInfoInputModel;

     // update user
     if (firstName) req.user.firstName = firstName;
     if (lastName) req.user.lastName = lastName;
     if (phoneNumber) req.user.phoneNumber = phoneNumber;
     if (email) req.user.email = email;
     if (email) req.user.isVerified = false;
     await req.user.save();

     if (email) {
          // send verification email
          await sendVerificationEmail(req.user, email);

          // logout user when email is mutated, and send email for email verification link
          res.status(200).clearCookie(COOKIE_NAME).json({ message: "User info updated successfully, please check your email for verification" });
     } else {
          res.status(200).json({ message: "User info updated successfully" });
     }
});
