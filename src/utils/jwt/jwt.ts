import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import { COOKIE_EXPIRES, COOKIE_NAME, JWT_EXPIRES, JWT_SECRET, NODE_ENV } from "@/constants/env";

export const createToken = (id: string) => {
     return jwt.sign({ id }, `${JWT_SECRET}`, {
          expiresIn: JWT_EXPIRES,
     });
};

export const sendToken = (id: string, statusCode: number, res: Response) => {
     const token = createToken(id);
     const expiryIn = Date.now() + Number(COOKIE_EXPIRES);
     const cookieOption: CookieOptions = {
          expires: new Date(expiryIn),
          httpOnly: true,
          secure: false,
     };
     const environment = NODE_ENV;
     if (environment === "production" || environment === "staging") cookieOption.secure = true;
     res.status(statusCode).cookie(COOKIE_NAME, token, cookieOption).json({ message: "Logged In Successfully" });
};
