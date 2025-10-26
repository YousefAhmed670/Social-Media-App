"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutationResponse = exports.usersResponse = exports.userResponse = exports.UserType = void 0;
const graphql_1 = require("graphql");
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        fullName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
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
exports.userResponse = new graphql_1.GraphQLObjectType({
    name: "UserQuery",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        data: { type: exports.UserType },
    }),
});
exports.usersResponse = new graphql_1.GraphQLObjectType({
    name: "UsersQuery",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
        data: { type: new graphql_1.GraphQLList(exports.UserType) },
    }),
});
exports.userMutationResponse = new graphql_1.GraphQLObjectType({
    name: "UserMutation",
    fields: () => ({
        message: { type: graphql_1.GraphQLString },
        success: { type: graphql_1.GraphQLBoolean },
    }),
});
