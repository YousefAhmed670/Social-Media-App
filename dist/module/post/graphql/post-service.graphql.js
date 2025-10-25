"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.getSpecificPost = void 0;
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
            { path: "comments", populate: { path: "userId" } },
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
