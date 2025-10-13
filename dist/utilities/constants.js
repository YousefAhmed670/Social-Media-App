"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_TEMPLATES = exports.RATE_LIMIT_MAX_REQUESTS = exports.RATE_LIMIT_WINDOW_MS = exports.TOKEN_CLEANUP_DAYS = exports.OTP_EXPIRY_TIME = void 0;
// Time constants (in minutes)
exports.OTP_EXPIRY_TIME = 10;
exports.TOKEN_CLEANUP_DAYS = 1;
// Rate limiting
exports.RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
exports.RATE_LIMIT_MAX_REQUESTS = 10;
// Email templates
exports.EMAIL_TEMPLATES = {
    REGISTER_OTP: {
        subject: "Verify Your Email - Social App",
        getHtml: (otp) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Social App!</h2>
        <p>Thank you for registering. Please use the following OTP to verify your email:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; margin: 0; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666;">This OTP will expire in ${exports.OTP_EXPIRY_TIME} minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    },
    SEND_OTP: {
        subject: "Your OTP Code - Social App",
        getHtml: (otp) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>You requested an OTP code. Please use the following code:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2196F3; margin: 0; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666;">This OTP will expire in ${exports.OTP_EXPIRY_TIME} minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please secure your account immediately.</p>
      </div>
    `,
    },
};
