"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2StepLoginSchema = exports.resetPasswordSchema = exports.verifyEmailSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const utilities_1 = require("../../utilities");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(30),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6).max(20),
    phoneNumber: zod_1.z.string().length(11).optional(),
    gender: zod_1.z.enum(utilities_1.GENDER).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6).max(20),
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().min(6).max(6),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().min(6).max(6),
    password: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string().min(6),
});
exports.verify2StepLoginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    secret: zod_1.z.string().min(6).max(6),
});
