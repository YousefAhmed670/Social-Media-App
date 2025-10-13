import { Router } from "express";
import { isAuthenticated } from "../../middleware";
import CommentService from "./comment.service";

const router = Router({ mergeParams: true });
router.post("{/:id}", isAuthenticated, CommentService.create);
router.patch("/:id/react", isAuthenticated, CommentService.react);
router.get("/:id", isAuthenticated, CommentService.getSpecific);
router.delete("/:id", isAuthenticated, CommentService.deleteComment);

export default router;