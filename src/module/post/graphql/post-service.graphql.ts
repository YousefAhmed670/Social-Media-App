import { PostRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { NotFoundException } from "../../../utilities";
import {
  getPostValidation,
  getPostsValidation,
  createPostValidation,
  updatePostValidation,
  deletePostValidation,
} from "./post-validation.graphql";

const postRepository = new PostRepository();

export const getSpecificPost = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(getPostValidation, args);
  const post = await postRepository.getOne(
    { _id: args.id },
    {},
    {
      populate: [
        { path: "userId" },
        { path: "reactions", populate: { path: "userId" } },
      ],
    }
  );
  if (!post) {
    throw new NotFoundException("Post not found");
  }
  return {
    message: "Post found successfully",
    success: true,
    data: post,
  };
};

export const getPosts = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(getPostsValidation, args);
  const posts = await postRepository.getAll(
    {},
    {},
    {
      populate: [
        { path: "userId" },
        { path: "reactions", populate: { path: "userId" } },
      ],
      limit: args.count,
      skip: (args.page - 1) * args.count,
    }
  );
  if (!posts) {
    throw new NotFoundException("Posts not found");
  }
  return {
    message: "Posts found successfully",
    success: true,
    data: posts,
  };
};

export const createPost = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(createPostValidation, args);
  const post = await postRepository.create({
    userId: context.user._id,
    content: args.content,
    attachments: args.attachments,
    mentions: args.mentions,
  });
  return {
    message: "Post created successfully",
    success: true,
    data: post,
  };
};

export const updatePost = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(updatePostValidation, args);
  const updateData: any = {};
  if (args.content) updateData.content = args.content;
  if (args.attachments !== undefined) updateData.attachments = args.attachments;
  if (args.mentions !== undefined) updateData.mentions = args.mentions;

  const post = await postRepository.update(
    { _id: args.id, userId: context.user._id },
    { $set: updateData }
  );
  if (!post) {
    throw new NotFoundException("Post not found");
  }
  return {
    message: "Post updated successfully",
    success: true,
    data: post,
  };
};

export const deletePost = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(deletePostValidation, args);
  const post = await postRepository.delete({ _id: args.id });
  if (!post) {
    throw new NotFoundException("Post not found");
  }
  return {
    message: "Post deleted successfully",
    success: true,
  };
};