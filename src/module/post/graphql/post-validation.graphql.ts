import { z } from "zod";

export const getPostValidation = z.object({
  id: z.string().length(24),
});

export const getPostsValidation = z.object({
  id: z.string().length(24).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(1).optional(),
});

export const createPostValidation = z.object({
  content: z.string().min(1),
  attachments: z.string().optional(),
  mentions: z.string().optional(),
});

export const updatePostValidation = z.object({
  id: z.string().length(24),
  content: z.string().min(1).optional(),
  attachments: z.string().optional(),
  mentions: z.string().optional(),
});

export const deletePostValidation = z.object({
  id: z.string().length(24),
});
