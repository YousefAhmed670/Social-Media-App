import { CommentRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { NotFoundException } from "../../../utilities";
import {
  getCommentsValidation,
  getCommentValidation,
} from "./comment-validation.graphql";

const commentRepository = new CommentRepository();
export const getComment = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(getCommentValidation, args);
  const comment = await commentRepository.getOne(
    { _id: args.id },
    {},
    {
      populate: [
        { path: "userId" },
        { path: "postId", populate: { path: "userId" } },
        { path: "parentId", populate: { path: "userId" } },
        { path: "mentions" },
        { path: "reactions", populate: { path: "userId" } },
      ],
    }
  );
  if (!comment) {
    throw new NotFoundException("Comment not found");
  }
  return {
    message: "Comment found successfully",
    success: true,
    data: comment,
  };
};
export const getComments = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(getCommentsValidation, args);
  const comments = await commentRepository.getAll(
    {},
    {},
    {
      populate: [
        { path: "userId" },
        { path: "postId", populate: { path: "userId" } },
        { path: "parentId", populate: { path: "userId" } },
        { path: "mentions" },
        { path: "reactions", populate: { path: "userId" } },
      ],
      limit: args.count,
      skip: (args.page - 1) * args.count,
    }
  );
  if (!comments) {
    throw new NotFoundException("Comments not found");
  }
  return {
    message: "Comments found successfully",
    success: true,
    data: comments,
  };
};
