import { z } from "zod";

export const getCommentValidation = z.object({
  id: z.string().length(24),
});

export const getCommentsValidation = z.object({
  id: z.string().length(24).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(1).optional(),
});
