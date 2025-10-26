import { CommentRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { NotFoundException } from "../../../utilities";
import {
  getCommentsValidation,
  getCommentValidation,
  createCommentValidation,
  updateCommentValidation,
  deleteCommentValidation,
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

export const createComment = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(createCommentValidation, args);
  const comment = await commentRepository.create({
    userId: context.user._id,
    postId: args.postId,
    parentId: args.parentId,
    content: args.content,
    attachments: args.attachments,
    mentions: args.mentions,
  });
  return {
    message: "Comment created successfully",
    success: true,
    data: comment,
  };
};

export const updateComment = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(updateCommentValidation, args);
  const updateData: any = {};
  if (args.content) updateData.content = args.content;
  if (args.attachments !== undefined) updateData.attachments = args.attachments;
  if (args.mentions !== undefined) updateData.mentions = args.mentions;
  
  const comment = await commentRepository.update(
    { _id: args.id ,userId: context.user._id},
    { $set: updateData }
  );
  if (!comment) {
    throw new NotFoundException("Comment not found");
  }
  return {
    message: "Comment updated successfully",
    success: true,
    data: comment,
  };
};

export const deleteComment = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(deleteCommentValidation, args);
  const comment = await commentRepository.delete({ _id: args.id });
  if (!comment) {
    throw new NotFoundException("Comment not found");
  }
  return {
    message: "Comment deleted successfully",
    success: true,
  };
};
