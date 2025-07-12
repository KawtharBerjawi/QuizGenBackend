import { Router } from "express";
import dto from "@/middlewares/dto/dto";
import { isAuthenticated } from "@/middlewares/auth/auth";
import { login, emailVerificationRequest, forgetPassword, loggedUser, logout, resetPassword, updateInformation, updatePassword, verifyEmail, register } from "@/controllers/auth";
import { RegisterInputModel, LoginInputModel, EmailVerificationInputModel, VerifyEmailParams, ForgetPasswordInputModel, ResetPasswordInputModel, ResetPasswordParams, UpdateUserInfoInputModel, UpdatePasswordInputModel } from "@/dtos/auth";

const router = Router();

router.post("/register", dto(RegisterInputModel), register);
router.post("/login", dto(LoginInputModel), login);
router.get("/logout", logout);
router.get("/loggedUser", isAuthenticated, loggedUser);
router.get("/emailVerification", dto(EmailVerificationInputModel), emailVerificationRequest);
router.put("/forgetPassword", dto(ForgetPasswordInputModel), forgetPassword);
router.put("/resetPassword/:token", dto(ResetPasswordParams, 'params'), dto(ResetPasswordInputModel), resetPassword);
router.put("/emailVerification/:token", dto(VerifyEmailParams, 'params'), verifyEmail);
router.put("/password", isAuthenticated, dto(UpdatePasswordInputModel), updatePassword);
router.put("/accountInformation", isAuthenticated, dto(UpdateUserInfoInputModel), updateInformation);

export default router;