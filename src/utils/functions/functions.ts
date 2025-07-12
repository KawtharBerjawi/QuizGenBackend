import User from "@/models/user";
import ErrorHandler from "../errors/errors";
import { ValidationError } from "class-validator";
import { emailVerificationEmail, sendResetTokenEmail } from "../mails/mails";
import { EMAIL_VERIFICATION_PAGE_URL, RESET_PASSWORD_PAGE_URL } from "@/constants/env";

// generates unique usernames
export const generateUniqueUsername = (firstName: string, lastName: string) => {
     const capitalize = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     const capFirstName = capitalize(firstName);
     const capLastName = capitalize(lastName);
     const uniqueNumber = Date.now().toString().slice(-4);
     const username = `${capFirstName}.${capLastName}.${uniqueNumber}`;
     return username;
};

// removes files extension from file name
export function removeFileExtension(filename: string) {
     return filename.replace(/\.[^/.]+$/, "");
}

// gets refactored error message
export const getErrorMessage = (errors: ValidationError[]): string => {
     if (!errors.length || !errors[0].constraints) return "validationError";
     const message = Object.values(errors[0].constraints)[0] as string;
     return message;
};

// checks user validity
export const checkUserValidity = (user: User | null) => {
     if (!user) throw new ErrorHandler("User Not Found", 404);
     if (!user.isActivated) throw new ErrorHandler("User Deactivated", 403);
     if (!user.isVerified) throw new ErrorHandler("User Email Not Verified", 403);
};

// sends verification email
export const sendVerificationEmail = async (user: User, email: string) => {
     try {
          // generate verification token
          const verificationToken = await user.getEmailVerificationToken();

          // send verification email
          await emailVerificationEmail(email, verificationToken, EMAIL_VERIFICATION_PAGE_URL);
     } catch (error) {
          // remove token related fields on failure
          user.emailVerificationToken = null;
          user.emailVerificationExpiry = null;
          await user.save();

          throw error;
     }
};

// sends verification email
export const sendPasswordResetEmail = async (user: User, email: string) => {
     try {
          // generate verification token
          const passwordResetToken = await user.getPasswordResetToken();

          // send verification email
          await sendResetTokenEmail(email, passwordResetToken, RESET_PASSWORD_PAGE_URL);
     } catch (error) {
          // remove token related fields on failure
          user.passwordResetToken = null;
          user.passwordResetExpiry = null;
          await user.save();

          throw error;
     }
};
