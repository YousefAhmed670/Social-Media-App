"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersValidation = exports.getUserValidation = void 0;
const zod_1 = require("zod");
exports.getUserValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
exports.getUsersValidation = zod_1.z.object({
    id: zod_1.z.string().length(24).optional(),
    page: zod_1.z.number().min(1).optional(),
    count: zod_1.z.number().min(1).optional(),
});
