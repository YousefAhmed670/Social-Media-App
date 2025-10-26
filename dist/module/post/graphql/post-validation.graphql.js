"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostValidation = exports.updatePostValidation = exports.createPostValidation = exports.getPostsValidation = exports.getPostValidation = void 0;
const zod_1 = require("zod");
exports.getPostValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
exports.getPostsValidation = zod_1.z.object({
    id: zod_1.z.string().length(24).optional(),
    page: zod_1.z.number().min(1).optional(),
    count: zod_1.z.number().min(1).optional(),
});
exports.createPostValidation = zod_1.z.object({
    content: zod_1.z.string().min(1),
    attachments: zod_1.z.string().optional(),
    mentions: zod_1.z.string().optional(),
});
exports.updatePostValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
    content: zod_1.z.string().min(1).optional(),
    attachments: zod_1.z.string().optional(),
    mentions: zod_1.z.string().optional(),
});
exports.deletePostValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
