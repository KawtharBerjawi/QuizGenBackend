import { IsString, IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber, MaxLength, MinLength, IsStrongPassword } from "class-validator";

export class LoginInputModel {
     @IsEmail()
     email!: string

     @IsString()
     @MaxLength(50)
     @MinLength(8)
     password!: string
}

export class RegisterInputModel {
     @IsString()
     @MaxLength(100)
     @IsNotEmpty()
     firstName!: string;

     @IsString()
     @MaxLength(100)
     @IsNotEmpty()
     lastName!: string;

     @IsEmail()
     email!: string;

     @IsString()
     @MaxLength(8)
     @IsOptional()
     @IsPhoneNumber("LB", { message: () => ("Enter a lebanese valid phone number") })
     phoneNumber?: string;

     @IsString()
     @MaxLength(50)
     @MinLength(8)
     @IsStrongPassword({ minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1, minLength: 8 })
     password!: string;
}

export class ForgetPasswordInputModel {
     @IsEmail()
     email!: string
}

export class VerifyEmailParams {
     @IsString()
     token!: string;
}

export class EmailVerificationInputModel {
     @IsEmail()
     email!: string
}

export class ResetPasswordParams {
     @IsString()
     token!: string;
}

export class ResetPasswordInputModel {
     @IsString()
     @MaxLength(50)
     @MinLength(8)
     @IsStrongPassword({ minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1, minLength: 8 })
     password!: string;

     @IsString()
     @MaxLength(50)
     @MinLength(8)
     @IsStrongPassword({ minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1, minLength: 8 })
     confirmPassword!: string;
}

export class UpdatePasswordInputModel {
     @IsString()
     oldPassword!: string;

     @IsString()
     @MaxLength(50)
     @MinLength(8)
     @IsStrongPassword({ minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1, minLength: 8 })
     newPassword!: string;

     @IsString()
     @MaxLength(50)
     @MinLength(8)
     @IsStrongPassword({ minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1, minLength: 8 })
     confirmPassword!: string;
}

export class UpdateUserInfoInputModel {
     @IsString()
     @IsOptional()
     @MaxLength(100)
     firstName?: string;

     @IsString()
     @IsOptional()
     @MaxLength(100)
     lastName?: string;

     @IsEmail()
     @IsOptional()
     email?: string;

     @IsString()
     @IsOptional()
     @MaxLength(8)
     @IsPhoneNumber("LB", { message: () => ("Enter a lebanese valid phone number") })
     phoneNumber?: string;
}