import type { Request, Response } from "express";
import { TokenRepository, UserRepository } from "../../DB";
import * as utilities from "../../utilities";
import {
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  Verify2StepLoginDTO,
  VerifyEmailDTO,
} from "./auth.dto";
import { AuthFactoryService } from "./factory";
import { AuthProvider } from "./provider";
class AuthService {
  private readonly userRepository = new UserRepository();
  private readonly tokenRepository = new TokenRepository();
  private readonly authFactoryService = new AuthFactoryService();
  constructor() {}

  register = async (req: Request, res: Response) => {
    const registerDto: RegisterDTO = req.body;
    const userExist = await this.userRepository.exists({
      email: registerDto.email,
    });
    if (userExist) {
      throw new utilities.ConflictException("User already exists");
    }
    const user = await this.authFactoryService.registerFactory(registerDto);
    const createdUser = await this.userRepository.create(user);
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { createdUser },
    });
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { otp, email }: VerifyEmailDTO = req.body;
    await AuthProvider.checkOTP(email, otp);
    await this.userRepository.update(
      { email },
      {
        $unset: { otp: "", otpExpireAt: "" },
        $set: { isVerified: true },
      }
    );
    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  };

  sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;
    const userExist = await this.userRepository.exists({ email });
    if (!userExist) {
      throw new utilities.NotFoundException("User not found");
    }
    if (
      userExist.otp &&
      userExist.otpExpireAt &&
      userExist.otpExpireAt.getTime() > Date.now()
    ) {
      throw new utilities.BadRequestException(
        "OTP already sent. Please wait before requesting a new one"
      );
    }
    if (userExist.userAgent != utilities.USER_AGENT.Google) {
      const OTP = utilities.generateOTP();
      const otpExpireAt = utilities.generateExpiryTime(10);
      const hashedOTP = await utilities.generateHash(OTP);
      await this.userRepository.update(
        { email },
        { otp: hashedOTP, otpExpireAt }
      );
      utilities.eventEmitter.emit("sendOTP", {
        email: userExist.email,
        otp: OTP,
      });
    }
    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  };

  login = async (req: Request, res: Response) => {
    const loginDTO: LoginDTO = req.body;
    const userExist = await this.userRepository.exists({
      email: loginDTO.email,
    });
    if (!userExist) {
      throw new utilities.NotFoundException("User not found");
    }
    if (
      !userExist.password ||
      !(await utilities.compareHash(loginDTO.password, userExist.password))
    ) {
      throw new utilities.BadRequestException("Invalid password");
    }
    if (!userExist.isVerified) {
      throw new utilities.BadRequestException(
        "Email not verified. Please verify your email to continue"
      );
    }
    if (userExist.twoStepVerificationEnabled) {
      const secret = utilities.generateOTP();
      const otpExpireAt = utilities.generateExpiryTime(10);
      const twoStepVerificationSecret = await utilities.generateHash(secret);
      await this.userRepository.update(
        { email: loginDTO.email },
        { twoStepVerificationSecret, otpExpireAt }
      );
      utilities.eventEmitter.emit("2StepLogin", {
        email: userExist.email,
        secret,
      });
      return res.status(200).json({
        message: "2-step verification required. 2-step OTP sent to your email",
        success: true,
        data: { requiresTwoFactor: true },
      });
    }
    const accessToken = utilities.generateToken({
      payload: {
        _id: userExist._id,
        userAgent: userExist.userAgent,
        role: userExist.role,
      },
    });
    const refreshToken = utilities.generateRefreshToken({
      payload: {
        _id: userExist._id,
        userAgent: userExist.userAgent,
        role: userExist.role,
      },
    });
    await this.tokenRepository.create({
      userId: userExist._id,
      token: refreshToken,
      type: utilities.TOKEN_TYPE.Refresh,
    });
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: { accessToken, refreshToken },
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const resetPasswordDto: ResetPasswordDTO = req.body;
    await AuthProvider.checkOTP(resetPasswordDto.email, resetPasswordDto.otp);
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new utilities.BadRequestException("Passwords do not match");
    }
    await this.userRepository.update(
      { email: resetPasswordDto.email },
      {
        password: await utilities.generateHash(resetPasswordDto.password),
        $unset: { otp: "", otpExpireAt: "" },
      }
    );
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.headers.refreshtoken;
    if (!refreshToken) {
      throw new utilities.BadRequestException("Refresh token is required");
    }
    const payload = utilities.verifyRefreshToken(refreshToken as string);
    const user = await this.userRepository.exists({
      _id: payload._id,
    });
    if (!user) {
      throw new utilities.NotFoundException("User not found");
    }
    const accessToken = utilities.generateToken({
      payload: {
        _id: user._id,
        userAgent: utilities.USER_AGENT.Google,
        role: utilities.SYS_ROLE.User,
      },
    });
    const newRefreshToken = utilities.generateRefreshToken({
      payload: {
        _id: user._id,
        userAgent: utilities.USER_AGENT.Google,
        role: utilities.SYS_ROLE.User,
      },
    });
    await this.tokenRepository.create({
      userId: user._id,
      token: newRefreshToken,
      type: utilities.TOKEN_TYPE.Refresh,
    });
    return res.status(200).json({
      message: "Token generated successfully",
      success: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  };

  verify2StepLogin = async (req: Request, res: Response) => {
    const { email, secret }: Verify2StepLoginDTO = req.body;
    const userExist = await this.userRepository.exists({ email });
    if (!userExist) {
      throw new utilities.NotFoundException("User not found");
    }
    if (!userExist.twoStepVerificationEnabled) {
      throw new utilities.BadRequestException(
        "2-step verification is not enabled for this account"
      );
    }
    if (!userExist.twoStepVerificationSecret) {
      throw new utilities.BadRequestException(
        "No 2-step verification code found. Please login again"
      );
    }
    if (
      userExist?.otpExpireAt &&
      userExist.otpExpireAt.getTime() < Date.now()
    ) {
      throw new utilities.BadRequestException(
        "2-step verification code expired. Please login again"
      );
    }
    const isOTPValid = await utilities.compareHash(
      secret,
      userExist.twoStepVerificationSecret
    );
    if (!isOTPValid) {
      throw new utilities.BadRequestException(
        "Invalid 2-step verification code"
      );
    }
    // Clean up 2FA secrets after successful verification
    await this.userRepository.update(
      { email },
      {
        $unset: { twoStepVerificationSecret: "", otpExpireAt: "" },
      }
    );
    const accessToken = utilities.generateToken({
      payload: {
        _id: userExist._id,
        userAgent: userExist.userAgent,
        role: userExist.role,
      },
    });
    const refreshToken = utilities.generateRefreshToken({
      payload: {
        _id: userExist._id,
        userAgent: userExist.userAgent,
        role: userExist.role,
      },
    });
    await this.tokenRepository.create({
      userId: userExist._id,
      token: refreshToken,
      type: utilities.TOKEN_TYPE.Refresh,
    });
    return res.status(200).json({
      message: "2-step verification successful. User logged in",
      success: true,
      data: { accessToken, refreshToken },
    });
  };

  logout = async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const userExist = req.user;
    if (!userExist) {
      throw new utilities.NotFoundException("User not found");
    }
    await this.tokenRepository.create({
      userId: userExist._id,
      token: token as string,
      type: utilities.TOKEN_TYPE.Access,
    });
    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  };
}

export default new AuthService();
