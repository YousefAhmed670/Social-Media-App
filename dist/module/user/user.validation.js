"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable2StepSchema = exports.disable2StepRequestSchema = exports.verify2StepSchema = exports.request2StepSchema = exports.updateEmailSchema = exports.updateBasicInfoSchema = exports.updatePasswordSchema = void 0;
const zod_1 = require("zod");
const utilities_1 = require("../../utilities");
exports.updatePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6, "password must be at least 6 characters"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().min(6, "Confirm password must be at least 6 characters"),
});
exports.updateBasicInfoSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(3).max(20).trim().optional(),
    lastName: zod_1.z.string().min(3).max(20).trim().optional(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.enum(utilities_1.GENDER).optional(),
});
exports.updateEmailSchema = zod_1.z.object({
    newEmail: zod_1.z.string().email("Invalid email format"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
exports.request2StepSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.verify2StepSchema = zod_1.z.object({
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
exports.disable2StepRequestSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.disable2StepSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
