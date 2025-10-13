import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utilities/error";
import { z } from "zod";

export const isValid = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let data = { ...req.body, ...req.query, ...req.params };
    const validate = schema.safeParse(data);
    if (validate.success == false) {
      const errMassages = validate.error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      }));
      throw new BadRequestException("validation error", errMassages);
    }
    next();
  };
};
