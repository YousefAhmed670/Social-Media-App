import { z } from "zod";
import { GENDER } from "../../utilities";
import {
  Disable2StepDTO,
  Disable2StepRequestDTO,
  Request2StepDTO,
  UpdateBasicInfoDTO,
  UpdateEmailDTO,
  UpdatePasswordDTO,
  Verify2StepDTO,
} from "./user.dto";

export const updatePasswordSchema = z.object<UpdatePasswordDTO>({
  currentPassword: z.string().min(6, "password must be at least 6 characters") as unknown as string,
  newPassword: z.string().min(6, "New password must be at least 6 characters") as unknown as string,
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters") as unknown as string,
});

export const updateBasicInfoSchema = z.object<UpdateBasicInfoDTO>({
  firstName: z.string().min(3).max(20).trim().optional() as unknown as string,
  lastName: z.string().min(3).max(20).trim().optional() as unknown as string,
  phoneNumber: z.string().optional() as unknown as string,
  gender: z.enum(GENDER).optional() as unknown as GENDER,
});

export const updateEmailSchema = z.object<UpdateEmailDTO>({
  newEmail: z.string().email("Invalid email format") as unknown as string,
  otp: z.string().length(6, "OTP must be 6 digits") as unknown as string,
});

export const request2StepSchema = z.object<Request2StepDTO>({
  password: z.string().min(6, "Password must be at least 6 characters") as unknown as string,
});

export const verify2StepSchema = z.object<Verify2StepDTO>({
  otp: z.string().length(6, "OTP must be 6 digits") as unknown as string,
});

export const disable2StepRequestSchema = z.object<Disable2StepRequestDTO>({
  password: z.string().min(6, "Password must be at least 6 characters") as unknown as string,
});

export const disable2StepSchema = z.object<Disable2StepDTO>({
  password: z.string().min(6, "Password must be at least 6 characters") as unknown as string,
  otp: z.string().length(6, "OTP must be 6 digits") as unknown as string,
});