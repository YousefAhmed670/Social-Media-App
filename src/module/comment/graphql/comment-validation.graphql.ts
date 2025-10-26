import { z } from "zod";

export const getCommentValidation = z.object({
  id: z.string().length(24),
});

export const getCommentsValidation = z.object({
  id: z.string().length(24).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(1).optional(),
});

export const createCommentValidation = z.object({
  postId: z.string().length(24),
  parentId: z.string().length(24).optional(),
  content: z.string().min(1),
  attachments: z.string().optional(),
  mentions: z.string().optional(),
});

export const updateCommentValidation = z.object({
  id: z.string().length(24),
  content: z.string().min(1).optional(),
  attachments: z.string().optional(),
  mentions: z.string().optional(),
});

export const deleteCommentValidation = z.object({
  id: z.string().length(24),
});