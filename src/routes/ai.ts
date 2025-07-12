import { Router } from "express";
import { postQuiz } from "@/controllers/ai";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth/auth";

const router = Router();

router.post("/quiz", isAuthenticated, isAuthorized(["instructor"]), postQuiz);

export default router;
