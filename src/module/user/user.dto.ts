import { GENDER } from "../../utilities";

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateBasicInfoDTO {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: GENDER;
}

export interface UpdateEmailDTO {
  newEmail: string;
  otp: string;
}

export interface Request2StepDTO {
  password: string;
}

export interface Verify2StepDTO {
  otp: string;
}

export interface Disable2StepRequestDTO {
  password: string;
}

export interface Disable2StepDTO {
  password: string;
  otp: string;
}
