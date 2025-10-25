"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQuery = void 0;
const graphql_1 = require("graphql");
const post_service_graphql_1 = require("./post-service.graphql");
const post_type_graphql_1 = require("./post-type.graphql");
exports.postQuery = {
    post: {
        type: post_type_graphql_1.postResponse,
        args: { id: { type: graphql_1.GraphQLID } },
        resolve: post_service_graphql_1.getSpecificPost,
    },
    posts: {
        type: post_type_graphql_1.postsResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
            count: { type: graphql_1.GraphQLInt },
            page: { type: graphql_1.GraphQLInt },
        },
        resolve: post_service_graphql_1.getPosts,
    },
};
