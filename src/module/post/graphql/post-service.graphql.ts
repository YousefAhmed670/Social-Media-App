import { PostRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { NotFoundException } from "../../../utilities";
import {
  getPostValidation,
  getPostsValidation,
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
        { path: "comments", populate: { path: "userId" } },
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
