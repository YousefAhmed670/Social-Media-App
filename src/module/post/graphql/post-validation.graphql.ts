import { z } from "zod";

export const getPostValidation = z.object({
  id: z.string().length(24),
});

export const getPostsValidation = z.object({
  id: z.string().length(24).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(1).optional(),
});
