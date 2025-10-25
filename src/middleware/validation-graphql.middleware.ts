import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utilities/error";
import { z } from "zod";

export const isValidGraphql = (schema: z.ZodType, args: any) => {
  const validate = schema.safeParse(args);
  if (validate.success == false) {
    const errMassages = validate.error.issues.map((issue) => ({
      path: issue.path[0],
      message: issue.message,
    }));
    throw new BadRequestException(JSON.stringify(errMassages));
  }
};
