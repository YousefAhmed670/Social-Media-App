import cors from "cors";
import { NextFunction, Request, Response, type Express } from "express";
import rateLimit from "express-rate-limit";
import { GraphQLError } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./app.schema";
import { connectDB } from "./DB";
import {
  authRouter,
  chatRouter,
  commentRouter,
  postRouter,
  userRouter,
} from "./module";
import { AppError } from "./utilities";
import { startTokenCleanupJob } from "./utilities/cronJob";
export function bootstrap(app: Express, express: any) {
  connectDB();
  app.use(express.json());
  app.use(cors({ origin: "*" }));
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    message: "Too many requests from this IP, please try again after 5 minutes",
    handler: (req, res, next, options) => {
      throw new Error(options.message, { cause: options.statusCode });
    },
  });
  app.all(
    "/graphql",
    createHandler({
      schema,
      formatError: (error: GraphQLError) => {
        return {
          message: error.message,
          success: false,
          path: error.path,
          errorsDetails: error.originalError,
        } as unknown as GraphQLError;
      },
      context: (req) => {
        const token = req.headers["authorization"];
        return { token };
      },
    })
  );
  app.use("/auth", limiter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/chat", chatRouter);
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
