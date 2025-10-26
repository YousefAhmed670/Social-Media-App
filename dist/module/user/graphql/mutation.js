"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutation = void 0;
const graphql_1 = require("graphql");
const user_service_graphql_1 = require("./user-service.graphql");
const user_type_graphql_1 = require("./user-type.graphql");
exports.userMutation = {
    updateUser: {
        type: user_type_graphql_1.userMutationResponse,
        args: {
            firstName: { type: graphql_1.GraphQLString },
            lastName: { type: graphql_1.GraphQLString },
            phoneNumber: { type: graphql_1.GraphQLString },
            gender: { type: graphql_1.GraphQLString },
        },
        resolve: user_service_graphql_1.updateUser,
    },
    deleteUser: {
        type: user_type_graphql_1.userMutationResponse,
        args: {},
        resolve: user_service_graphql_1.deleteUser,
    },
};
