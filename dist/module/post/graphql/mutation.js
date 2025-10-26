"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMutation = void 0;
const graphql_1 = require("graphql");
const post_service_graphql_1 = require("./post-service.graphql");
const post_type_graphql_1 = require("./post-type.graphql");
exports.postMutation = {
    createPost: {
        type: post_type_graphql_1.postMutationResponse,
        args: {
            content: { type: graphql_1.GraphQLString },
            attachments: { type: graphql_1.GraphQLString },
            mentions: { type: graphql_1.GraphQLString },
        },
        resolve: post_service_graphql_1.createPost,
    },
    updatePost: {
        type: post_type_graphql_1.postMutationResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
            content: { type: graphql_1.GraphQLString },
            attachments: { type: graphql_1.GraphQLString },
            mentions: { type: graphql_1.GraphQLString },
        },
        resolve: post_service_graphql_1.updatePost,
    },
    deletePost: {
        type: post_type_graphql_1.postMutationResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
        },
        resolve: post_service_graphql_1.deletePost,
    },
};
