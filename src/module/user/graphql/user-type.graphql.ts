import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from "graphql";

export const UserType: GraphQLOutputType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: {
      type: GraphQLString,
      resolve: (parent) =>
        parent?.createdAt ? parent.createdAt.toISOString() : null,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (parent) =>
        parent?.updatedAt ? parent.updatedAt.toISOString() : null,
    },
  }),
});

export const userResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "UserQuery",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    data: { type: UserType },
  }),
});

export const usersResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "UsersQuery",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    data: { type: new GraphQLList(UserType) },
  }),
});

export const userMutationResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "UserMutation",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
  }),
});
