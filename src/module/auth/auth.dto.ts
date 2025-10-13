import { GENDER } from "../../utilities";

export interface RegisterDTO {
      fullName?: string;
      email: string;
      password: string;
      phoneNumber?: string;
      gender: GENDER;
}

export interface VerifyEmailDTO {
  email: string;
  otp: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface Verify2StepLoginDTO {
  email: string;
  secret: string;
}