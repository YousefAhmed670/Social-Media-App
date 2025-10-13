"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const __1 = require("..");
const middleware_1 = require("../../middleware");
const post_service_1 = __importDefault(require("./post.service"));
const router = (0, express_1.default)();
router.use("/:postId/comment", __1.commentRouter);
router.post("/", middleware_1.isAuthenticated, post_service_1.default.create);
router.patch("/:id", middleware_1.isAuthenticated, post_service_1.default.React);
router.get("/:id", middleware_1.isAuthenticated, post_service_1.default.getSpecific);
router.delete("/:id", middleware_1.isAuthenticated, post_service_1.default.deletePost);
exports.default = router;
