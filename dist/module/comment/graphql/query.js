"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentQuery = void 0;
const graphql_1 = require("graphql");
const comment_type_graphql_1 = require("./comment-type.graphql");
const comment_service_graphql_1 = require("./comment.service.graphql");
exports.commentQuery = {
    comment: {
        type: comment_type_graphql_1.commentResponse,
        args: { id: { type: graphql_1.GraphQLID } },
        resolve: comment_service_graphql_1.getComment,
    },
    comments: {
        type: comment_type_graphql_1.commentsResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
            count: { type: graphql_1.GraphQLInt },
            page: { type: graphql_1.GraphQLInt },
        },
        resolve: comment_service_graphql_1.getComments,
    },
};
