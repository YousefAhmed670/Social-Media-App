import { NextFunction, Request, Response, type Express } from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "./DB";
import { authRouter, commentRouter, postRouter, userRouter } from "./module";
import { AppError } from "./utilities";
import { startTokenCleanupJob } from "./utilities/cronJob";
export function bootstrap(app: Express, express: any) {
  connectDB();
  app.use(express.json());
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    message: "Too many requests from this IP, please try again after 5 minutes",
    handler: (req, res, next, options) => {
      throw new Error(options.message, { cause: options.statusCode });
    },
  });
  app.use("/auth", limiter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  startTokenCleanupJob();
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "Not Found", success: false });
  });
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    return res.status(err.statusCode || 500).json({
      message: err.message,
      success: false,
      errorsDetails: err.errorsDetails,
    });
  });
}
