"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMutationResponse = exports.postsResponse = exports.postResponse = exports.PostType = exports.reactionType = void 0;
const graphql_1 = require("graphql");
const user_type_graphql_1 = require("../../user/graphql/user-type.graphql");
exports.reactionType = new graphql_1.GraphQLObjectType({
    name: "Reaction",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        reaction: { type: graphql_1.GraphQLInt },
    }),
});
exports.PostType = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        userId: { type: user_type_graphql_1.UserType },
        reactions: { type: new graphql_1.GraphQLList(exports.reactionType) },
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
exports.postResponse = new graphql_1.GraphQLObjectType({
    name: "PostQuery",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        data: { type: exports.PostType },
    }),
});
exports.postsResponse = new graphql_1.GraphQLObjectType({
    name: "PostsQuery",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        data: { type: new graphql_1.GraphQLList(exports.PostType) },
    }),
});
exports.postMutationResponse = new graphql_1.GraphQLObjectType({
    name: "PostMutation",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
    }),
});
