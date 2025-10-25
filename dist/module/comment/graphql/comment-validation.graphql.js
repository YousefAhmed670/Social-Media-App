"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsValidation = exports.getCommentValidation = void 0;
const zod_1 = require("zod");
exports.getCommentValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
exports.getCommentsValidation = zod_1.z.object({
    id: zod_1.z.string().length(24).optional(),
    page: zod_1.z.number().min(1).optional(),
    count: zod_1.z.number().min(1).optional(),
});
