import ejs from "ejs";
import path from "path";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import { SMTP_FROM_EMAIL, SMTP_FROM_NAME, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "@/constants/env";

const transporter = nodemailer.createTransport({
     host: SMTP_HOST,
     port: Number(SMTP_PORT),
     auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
     },
});

export const sendResetTokenEmail = async (email: string, token: string, baseUrl: string) => {
     const template = await fs.readFile(path.join("src", "utils", "mails", "templates", "sendResetToken.ejs"), "utf-8");
     const html = ejs.render(template, { token, baseUrl })
     const message = {
          from: `${SMTP_FROM_NAME}<${SMTP_FROM_EMAIL}>`,
          to: email,
          subject: "Reset Password URL",
          html
     }

     await transporter.sendMail(message);
}

export const emailVerificationEmail = async (email: string, token: string, baseUrl: string) => {
     const template = await fs.readFile(path.join("src", "utils", "mails", "templates", "sendResetToken.ejs"), "utf-8");
     const html = ejs.render(template, { token, baseUrl })
     const message = {
          from: `${SMTP_FROM_NAME}<${SMTP_FROM_EMAIL}>`,
          to: email,
          subject: "Verify Email URL",
          html
     }

     await transporter.sendMail(message);
}