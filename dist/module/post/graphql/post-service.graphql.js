"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPosts = exports.getSpecificPost = void 0;
const DB_1 = require("../../../DB");
const middleware_1 = require("../../../middleware");
const utilities_1 = require("../../../utilities");
const post_validation_graphql_1 = require("./post-validation.graphql");
const postRepository = new DB_1.PostRepository();
const getSpecificPost = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(post_validation_graphql_1.getPostValidation, args);
    const post = await postRepository.getOne({ _id: args.id }, {}, {
        populate: [
            { path: "userId" },
            { path: "reactions", populate: { path: "userId" } },
        ],
    });
    if (!post) {
        throw new utilities_1.NotFoundException("Post not found");
    }
    return {
        message: "Post found successfully",
        success: true,
        data: post,
    };
};
exports.getSpecificPost = getSpecificPost;
const getPosts = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(post_validation_graphql_1.getPostsValidation, args);
    const posts = await postRepository.getAll({}, {}, {
        populate: [
            { path: "userId" },
            { path: "reactions", populate: { path: "userId" } },
        ],
        limit: args.count,
        skip: (args.page - 1) * args.count,
    });
    if (!posts) {
        throw new utilities_1.NotFoundException("Posts not found");
    }
    return {
        message: "Posts found successfully",
        success: true,
        data: posts,
    };
};
exports.getPosts = getPosts;
const createPost = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(post_validation_graphql_1.createPostValidation, args);
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
exports.createPost = createPost;
const updatePost = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(post_validation_graphql_1.updatePostValidation, args);
    const updateData = {};
    if (args.content)
        updateData.content = args.content;
    if (args.attachments !== undefined)
        updateData.attachments = args.attachments;
    if (args.mentions !== undefined)
        updateData.mentions = args.mentions;
    const post = await postRepository.update({ _id: args.id, userId: context.user._id }, { $set: updateData });
    if (!post) {
        throw new utilities_1.NotFoundException("Post not found");
    }
    return {
        message: "Post updated successfully",
        success: true,
        data: post,
    };
};
exports.updatePost = updatePost;
const deletePost = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(post_validation_graphql_1.deletePostValidation, args);
    const post = await postRepository.delete({ _id: args.id });
    if (!post) {
        throw new utilities_1.NotFoundException("Post not found");
    }
    return {
        message: "Post deleted successfully",
        success: true,
    };
};
exports.deletePost = deletePost;
