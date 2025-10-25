"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.getComment = void 0;
const DB_1 = require("../../../DB");
const middleware_1 = require("../../../middleware");
const utilities_1 = require("../../../utilities");
const comment_validation_graphql_1 = require("./comment-validation.graphql");
const commentRepository = new DB_1.CommentRepository();
const getComment = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.getCommentValidation, args);
    const comment = await commentRepository.getOne({ _id: args.id }, {}, {
        populate: [
            { path: "userId" },
            { path: "postId", populate: { path: "userId" } },
            { path: "parentId", populate: { path: "userId" } },
            { path: "mentions" },
            { path: "reactions", populate: { path: "userId" } },
        ],
    });
    if (!comment) {
        throw new utilities_1.NotFoundException("Comment not found");
    }
    return {
        message: "Comment found successfully",
        success: true,
        data: comment,
    };
};
exports.getComment = getComment;
const getComments = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.getCommentsValidation, args);
    const comments = await commentRepository.getAll({}, {}, {
        populate: [
            { path: "userId" },
            { path: "postId", populate: { path: "userId" } },
            { path: "parentId", populate: { path: "userId" } },
            { path: "mentions" },
            { path: "reactions", populate: { path: "userId" } },
        ],
        limit: args.count,
        skip: (args.page - 1) * args.count,
    });
    if (!comments) {
        throw new utilities_1.NotFoundException("Comments not found");
    }
    return {
        message: "Comments found successfully",
        success: true,
        data: comments,
    };
};
exports.getComments = getComments;
