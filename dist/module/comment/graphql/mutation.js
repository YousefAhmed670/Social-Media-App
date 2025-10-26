"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentMutation = void 0;
const graphql_1 = require("graphql");
const comment_type_graphql_1 = require("./comment-type.graphql");
const comment_service_graphql_1 = require("./comment.service.graphql");
exports.commentMutation = {
    createComment: {
        type: comment_type_graphql_1.commentMutationResponse,
        args: {
            postId: { type: graphql_1.GraphQLID },
            parentId: { type: graphql_1.GraphQLID },
            content: { type: graphql_1.GraphQLString },
            attachments: { type: graphql_1.GraphQLString },
            mentions: { type: graphql_1.GraphQLString },
        },
        resolve: comment_service_graphql_1.createComment,
    },
    updateComment: {
        type: comment_type_graphql_1.commentMutationResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
            content: { type: graphql_1.GraphQLString },
            attachments: { type: graphql_1.GraphQLString },
            mentions: { type: graphql_1.GraphQLString },
        },
        resolve: comment_service_graphql_1.updateComment,
    },
    deleteComment: {
        type: comment_type_graphql_1.commentMutationResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
        },
        resolve: comment_service_graphql_1.deleteComment,
    },
};
