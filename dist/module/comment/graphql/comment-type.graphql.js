"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentMutationResponse = exports.commentsResponse = exports.commentResponse = exports.CommentType = void 0;
const graphql_1 = require("graphql");
const user_type_graphql_1 = require("../../user/graphql/user-type.graphql");
const post_type_graphql_1 = require("../../post/graphql/post-type.graphql");
exports.CommentType = new graphql_1.GraphQLObjectType({
    name: "Comment",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        userId: { type: user_type_graphql_1.UserType },
        postId: { type: post_type_graphql_1.PostType },
        parentId: { type: exports.CommentType },
        mentions: { type: new graphql_1.GraphQLList(user_type_graphql_1.UserType) },
        reactions: { type: new graphql_1.GraphQLList(post_type_graphql_1.reactionType) },
        createdAt: {
            type: graphql_1.GraphQLString,
            resolve: (parent) => parent?.createdAt ? parent.createdAt.toISOString() : null,
        },
        updatedAt: {
            type: graphql_1.GraphQLString,
            resolve: (parent) => parent?.updatedAt ? parent.updatedAt.toISOString() : null,
        },
    }),
});
exports.commentResponse = new graphql_1.GraphQLObjectType({
    name: "CommentQuery",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        data: { type: exports.CommentType },
    }),
});
exports.commentsResponse = new graphql_1.GraphQLObjectType({
    name: "CommentsQuery",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        data: { type: new graphql_1.GraphQLList(exports.CommentType) },
    }),
});
exports.commentMutationResponse = new graphql_1.GraphQLObjectType({
    name: "CommentMutation",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
    }),
});
