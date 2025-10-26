import { z } from "zod";

export const getUserValidation = z.object({
  id: z.string().length(24),
});

export const getUsersValidation = z.object({
  id: z.string().length(24).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(1).optional(),
});

export const updateUserValidation = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
});
