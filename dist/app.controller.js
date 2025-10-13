"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const DB_1 = require("./DB");
const module_1 = require("./module");
const cronJob_1 = require("./utilities/cronJob");
function bootstrap(app, express) {
    (0, DB_1.connectDB)();
    app.use(express.json());
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 5 * 60 * 1000,
        limit: 10,
        message: "Too many requests from this IP, please try again after 5 minutes",
        handler: (req, res, next, options) => {
            throw new Error(options.message, { cause: options.statusCode });
        },
    });
    app.use("/auth", limiter);
    app.use("/auth", module_1.authRouter);
    app.use("/user", module_1.userRouter);
    app.use("/post", module_1.postRouter);
    app.use("/comment", module_1.commentRouter);
    (0, cronJob_1.startTokenCleanupJob)();
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "Not Found", success: false });
    });
    app.use((err, req, res, next) => {
        console.log(err.stack);
        return res.status(err.statusCode || 500).json({
            message: err.message,
            success: false,
            errorsDetails: err.errorsDetails,
        });
    });
}
