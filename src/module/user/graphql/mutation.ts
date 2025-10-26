import { GraphQLString } from "graphql";
import { deleteUser, updateUser } from "./user-service.graphql";
import { userMutationResponse } from "./user-type.graphql";

export const userMutation = {
  updateUser: {
    type: userMutationResponse,
    args: {
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      phoneNumber: { type: GraphQLString },
      gender: { type: GraphQLString },
    },
    resolve: updateUser,
  },
  deleteUser: {
    type: userMutationResponse,
    args: {},
    resolve: deleteUser,
  },
};
