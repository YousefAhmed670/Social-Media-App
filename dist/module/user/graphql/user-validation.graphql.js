"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.getUsersValidation = exports.getUserValidation = void 0;
const zod_1 = require("zod");
exports.getUserValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
exports.getUsersValidation = zod_1.z.object({
    id: zod_1.z.string().length(24).optional(),
    page: zod_1.z.number().min(1).optional(),
    count: zod_1.z.number().min(1).optional(),
});
exports.updateUserValidation = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["male", "female"]).optional(),
});
