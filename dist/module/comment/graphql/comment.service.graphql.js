"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = exports.getComment = void 0;
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
const createComment = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.createCommentValidation, args);
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
exports.createComment = createComment;
const updateComment = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.updateCommentValidation, args);
    const updateData = {};
    if (args.content)
        updateData.content = args.content;
    if (args.attachments !== undefined)
        updateData.attachments = args.attachments;
    if (args.mentions !== undefined)
        updateData.mentions = args.mentions;
    const comment = await commentRepository.update({ _id: args.id, userId: context.user._id }, { $set: updateData });
    if (!comment) {
        throw new utilities_1.NotFoundException("Comment not found");
    }
    return {
        message: "Comment updated successfully",
        success: true,
        data: comment,
    };
};
exports.updateComment = updateComment;
const deleteComment = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.deleteCommentValidation, args);
    const comment = await commentRepository.delete({ _id: args.id });
    if (!comment) {
        throw new utilities_1.NotFoundException("Comment not found");
    }
    return {
        message: "Comment deleted successfully",
        success: true,
    };
};
exports.deleteComment = deleteComment;
