"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuery = void 0;
const graphql_1 = require("graphql");
const user_type_graphql_1 = require("./user-type.graphql");
const user_service_graphql_1 = require("./user-service.graphql");
exports.userQuery = {
    user: {
        type: user_type_graphql_1.userResponse,
        args: { id: { type: graphql_1.GraphQLID } },
        resolve: user_service_graphql_1.getUser,
    },
    users: {
        type: user_type_graphql_1.usersResponse,
        args: {
            count: { type: graphql_1.GraphQLInt },
            page: { type: graphql_1.GraphQLInt },
        },
        resolve: user_service_graphql_1.getUsers,
    },
};
