import type { Request, Response } from "express";
import { TokenRepository, UserRepository } from "../../DB";
import * as utilities from "../../utilities";
import {
  Disable2StepDTO,
  Disable2StepRequestDTO,
  Request2StepDTO,
  UpdateBasicInfoDTO,
  UpdateEmailDTO,
  UpdatePasswordDTO,
  Verify2StepDTO,
} from "./user.dto";

class UserService {
  private readonly userRepository = new UserRepository();
  private readonly tokenRepository = new TokenRepository();
  constructor() {}

  getProfile = async (req: Request, res: Response) => {
    const user = req.user;
    const userExists = await this.userRepository.getOne(
      { _id: req.params.id },
      {},
      {
        populate: [
          {
            path: "posts",
            populate: [
              {
                path: "userId",
                select: "fullName firstName lastName",
              },
              {
                path: "reactions.userId",
                select: "fullName firstName lastName",
              },
              {
                path: "comments",
                match: { parentIds: [] },
                populate: [
                  {
                    path: "userId",
                    select: "fullName firstName lastName",
                  },
                ],
              },
            ],
          },
        ],
      }
    );
    if (!userExists) {
      throw new utilities.NotFoundException("User not found");
    }
    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      data: { userExists },
    });
  };

  updatePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword, confirmPassword }: UpdatePasswordDTO =
      req.body;
    const user = req.user;
    if (!user.password) {
      throw new utilities.BadRequestException(
        "Cannot update password for social login users"
      );
    }
    const isPasswordValid = await utilities.compareHash(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new utilities.BadRequestException("Current password is incorrect");
    }
    if (newPassword !== confirmPassword) {
      throw new utilities.BadRequestException("Passwords do not match");
    }
    const hashedPassword = await utilities.generateHash(newPassword);
    await this.userRepository.update(
      { _id: user._id },
      { password: hashedPassword, credentialUpdatedAt: new Date() }
    );
    await this.tokenRepository.delete({
      userId: user._id,
      type: utilities.TOKEN_TYPE.Refresh,
    });
    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  };

  updateBasicInfo = async (req: Request, res: Response) => {
    const updateData: UpdateBasicInfoDTO = req.body;
    const user = req.user;
    if (
      !updateData.firstName &&
      !updateData.lastName &&
      !updateData.phoneNumber &&
      !updateData.gender
    ) {
      throw new utilities.BadRequestException("No data provided to update");
    }
    await this.userRepository.update({ _id: user._id }, updateData);
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
    });
  };

  requestEmailUpdate = async (req: Request, res: Response) => {
    const { newEmail } = req.body;
    const user = req.user;
    const emailExists = await this.userRepository.exists({ email: newEmail });
    if (emailExists) {
      throw new utilities.ConflictException("Email already in use");
    }
    const OTP = utilities.generateOTP();
    const otpExpireAt = utilities.generateExpiryTime(10);
    const hashedOTP = await utilities.generateHash(OTP);
    await this.userRepository.update(
      { _id: user._id },
      { otp: hashedOTP, otpExpireAt }
    );
    utilities.eventEmitter.emit("sendOTP", {
      email: newEmail,
      otp: OTP,
    });
    return res.status(200).json({
      message: "OTP sent to your new email",
      success: true,
    });
  };

  updateEmail = async (req: Request, res: Response) => {
    const { newEmail, otp }: UpdateEmailDTO = req.body;
    const user = req.user;
    if (!user.otp || !user.otpExpireAt) {
      throw new utilities.BadRequestException(
        "No OTP found. Please request email update first"
      );
    }
    if (user.otpExpireAt.getTime() < Date.now()) {
      throw new utilities.BadRequestException("OTP has expired");
    }
    const isOTPValid = await utilities.compareHash(otp, user.otp);
    if (!isOTPValid) {
      throw new utilities.BadRequestException("Invalid OTP");
    }
    const emailExists = await this.userRepository.exists({ email: newEmail });
    if (emailExists) {
      throw new utilities.ConflictException("Email already in use");
    }
    await this.userRepository.update(
      { _id: user._id },
      {
        email: newEmail,
        credentialUpdatedAt: new Date(),
        $unset: { otp: "", otpExpireAt: "" },
      }
    );
    return res.status(200).json({
      message: "Email updated successfully",
      success: true,
    });
  };

  request2StepVerification = async (req: Request, res: Response) => {
    const { password }: Request2StepDTO = req.body;
    const user = req.user;
    if (user.twoStepVerificationEnabled) {
      throw new utilities.BadRequestException(
        "Two-step verification is already enabled"
      );
    }
    if (!user.password) {
      throw new utilities.BadRequestException(
        "Cannot enable 2-step verification for social login users"
      );
    }
    const isPasswordValid = await utilities.compareHash(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new utilities.BadRequestException("Invalid password");
    }
    const OTP = utilities.generateOTP();
    const otpExpireAt = utilities.generateExpiryTime(10);
    const hashedOTP = await utilities.generateHash(OTP);
    await this.userRepository.update(
      { _id: user._id },
      { otp: hashedOTP, otpExpireAt }
    );
    utilities.eventEmitter.emit("sendOTP", {
      email: user.email,
      otp: OTP,
    });
    return res.status(200).json({
      message:
        "OTP sent to your email. Please verify to enable 2-step verification",
      success: true,
    });
  };

  enable2StepVerification = async (req: Request, res: Response) => {
    const { otp }: Verify2StepDTO = req.body;
    const user = req.user;
    if (!user.otp || !user.otpExpireAt) {
      throw new utilities.BadRequestException(
        "No 2-step verification request found"
      );
    }
    if (user.otpExpireAt.getTime() < Date.now()) {
      throw new utilities.BadRequestException("OTP has expired");
    }
    const isOTPValid = await utilities.compareHash(otp, user.otp);
    if (!isOTPValid) {
      throw new utilities.BadRequestException("Invalid OTP");
    }
    const secret = utilities.generateOTP();
    const otpExpireAt = utilities.generateExpiryTime(10);
    const twoStepVerificationSecret = await utilities.generateHash(secret);
    utilities.eventEmitter.emit("2StepLogin", {
      email: user.email,
      secret,
    });
    await this.userRepository.update(
      { _id: user._id },
      {
        twoStepVerificationEnabled: true,
        twoStepVerificationSecret,
        $unset: { otp: "", otpExpireAt: "" },
      }
    );
    return res.status(200).json({
      message: "Two-step verification enabled successfully",
      success: true,
      data: { "2-Step-Verification-Secret": secret },
    });
  };

  disable2StepVerificationRequest = async (req: Request, res: Response) => {
    const { password }: Disable2StepRequestDTO = req.body;
    const user = req.user;
    if (!user.password) {
      throw new utilities.BadRequestException(
        "Cannot disable 2-step verification for social login users"
      );
    }
    const isPasswordValid = await utilities.compareHash(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new utilities.BadRequestException("Invalid password");
    }
    const OTP = utilities.generateOTP();
    const otpExpireAt = utilities.generateExpiryTime(10);
    const hashedOTP = await utilities.generateHash(OTP);
    await this.userRepository.update(
      { _id: user._id },
      { otp: hashedOTP, otpExpireAt }
    );
    utilities.eventEmitter.emit("sendOTP", {
      email: user.email,
      otp: OTP,
    });
    return res.status(200).json({
      message:
        "OTP sent to your email. Please verify to disable 2-step verification",
      success: true,
    });
  };

  disable2StepVerification = async (req: Request, res: Response) => {
    const { password, otp }: Disable2StepDTO = req.body;
    const user = req.user;
    if (!user.twoStepVerificationEnabled) {
      throw new utilities.BadRequestException(
        "Two-step verification is not enabled"
      );
    }
    if (!user.password) {
      throw new utilities.BadRequestException(
        "Cannot disable 2-step verification for social login users"
      );
    }
    const isPasswordValid = await utilities.compareHash(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new utilities.BadRequestException("Invalid password");
    }
    if (!user.otp || !user.otpExpireAt) {
      throw new utilities.BadRequestException(
        "Please request 2-step verification first"
      );
    }
    if (user.otpExpireAt.getTime() < Date.now()) {
      throw new utilities.BadRequestException("OTP has expired");
    }
    const isOTPValid = await utilities.compareHash(otp, user.otp);
    if (!isOTPValid) {
      throw new utilities.BadRequestException("Invalid OTP");
    }
    await this.userRepository.update(
      { _id: user._id },
      {
        twoStepVerificationEnabled: false,
        $unset: { twoStepVerificationSecret: "", otp: "", otpExpireAt: "" },
      }
    );
    return res.status(200).json({
      message: "Two-step verification disabled successfully",
      success: true,
    });
  };
}

export default new UserService();
