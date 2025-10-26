import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from "graphql";
import { UserType } from "../../user/graphql/user-type.graphql";

export const reactionType: GraphQLOutputType = new GraphQLObjectType({
  name: "Reaction",
  fields: () => ({
    _id: { type: GraphQLID },
    reaction: { type: GraphQLInt },
  }),
});

export const PostType: GraphQLOutputType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    userId: { type: UserType },
    reactions: { type: new GraphQLList(reactionType) },
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

export const postResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "PostQuery",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    data: { type: PostType },
  }),
});

export const postsResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "PostsQuery",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    data: { type: new GraphQLList(PostType) },
  }),
});

export const postMutationResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "PostMutation",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
  }),
});