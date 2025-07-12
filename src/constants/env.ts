import dotenv from "dotenv";

dotenv.config();

// GENERAL
export const TZ = process.env.TZ!;
export const PORT = process.env.PORT!;
export const NODE_ENV = process.env.NODE_ENV!;

// DATABASE
export const POSTGRES_HOST = process.env.POSTGRES_HOST!;
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT!);
export const POSTGRES_NAME = process.env.POSTGRES_NAME!;
export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_PASS = process.env.POSTGRES_PASS!;

// REDIS
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = process.env.REDIS_PORT!;
export const REDIS_USER = process.env.REDIS_USER!;
export const REDIS_PASS = process.env.REDIS_PASS!;
export const REDIS_URL = process.env.REDIS_URL!;

// SEEDER - USER
export const SUPER_USER_EMAIL = process.env.SUPER_USER_EMAIL!;
export const SUPER_USER_FIRSTNAME = process.env.SUPER_USER_FIRSTNAME!;
export const SUPER_USER_LASTNAME = process.env.SUPER_USER_LASTNAME!;
export const SUPER_USER_PASSWORD = process.env.SUPER_USER_PASSWORD!;
export const SUPER_USER_PHONE_NUMBER = process.env.SUPER_USER_PHONE_NUMBER!;
export const SUPER_USER_USERNAME = process.env.SUPER_USER_USERNAME!;

// SEEDER - SYSTEM
export const SYSTEM_NAME = process.env.SYSTEM_NAME!;

// TOKEN & COOKIES
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES = process.env.JWT_EXPIRES!;
export const COOKIE_EXPIRES = process.env.COOKIE_EXPIRES!;
export const COOKIE_NAME = process.env.COOKIE_NAME!;

// SMTP
export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_PORT = process.env.SMTP_PORT!;
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASS = process.env.SMTP_PASS!;
export const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL!;
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME!;

// FRONTEND
export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const RESET_PASSWORD_PAGE_URL = process.env.RESET_PASSWORD_PAGE_URL!;
export const EMAIL_VERIFICATION_PAGE_URL = process.env.EMAIL_VERIFICATION_PAGE_URL!;

// HUGGINGFACE
export const HF_TOKEN = process.env.HF_TOKEN!;

