import { GraphQLID, GraphQLInt } from "graphql";
import { userResponse, usersResponse } from "./user-type.graphql";
import { getUser, getUsers } from "./user-service.graphql";

export const userQuery = {
  user: {
    type: userResponse,
    args: { id: { type: GraphQLID } },
    resolve: getUser,
  },
  users: {
    type: usersResponse,
    args: {
      count: { type: GraphQLInt },
      page: { type: GraphQLInt },
    },
    resolve: getUsers,
  },
};
