import Router from "express";
import { commentRouter } from "..";
import { isAuthenticated } from "../../middleware";
import PostService from "./post.service";
const router = Router();
router.use("/:postId/comment", commentRouter);

router.post("/", isAuthenticated, PostService.create);
router.patch("/:id", isAuthenticated, PostService.React);
router.put("/:id", isAuthenticated, PostService.updatePost);
router.get("/:id", isAuthenticated, PostService.getSpecific);
router.delete("/:id", isAuthenticated, PostService.deletePost);
router.patch("/:id/freeze", isAuthenticated, PostService.freezePost);

export default router;