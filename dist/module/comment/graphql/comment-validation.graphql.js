"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentValidation = exports.updateCommentValidation = exports.createCommentValidation = exports.getCommentsValidation = exports.getCommentValidation = void 0;
const zod_1 = require("zod");
exports.getCommentValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
exports.getCommentsValidation = zod_1.z.object({
    id: zod_1.z.string().length(24).optional(),
    page: zod_1.z.number().min(1).optional(),
    count: zod_1.z.number().min(1).optional(),
});
exports.createCommentValidation = zod_1.z.object({
    postId: zod_1.z.string().length(24),
    parentId: zod_1.z.string().length(24).optional(),
    content: zod_1.z.string().min(1),
    attachments: zod_1.z.string().optional(),
    mentions: zod_1.z.string().optional(),
});
exports.updateCommentValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
    content: zod_1.z.string().min(1).optional(),
    attachments: zod_1.z.string().optional(),
    mentions: zod_1.z.string().optional(),
});
exports.deleteCommentValidation = zod_1.z.object({
    id: zod_1.z.string().length(24),
});
