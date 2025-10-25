"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const query_1 = require("./module/user/graphql/query");
const query_2 = require("./module/post/graphql/query");
const query_3 = require("./module/comment/graphql/query");
const query = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...query_1.userQuery,
        ...query_2.postQuery,
        ...query_3.commentQuery,
    }
});
const mutation = null;
exports.schema = new graphql_1.GraphQLSchema({
    query,
    mutation,
});
