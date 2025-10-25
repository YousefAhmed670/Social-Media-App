import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from "graphql";
import { UserType } from "../../user/graphql/user-type.graphql";
import { PostType, reactionType } from "../../post/graphql/post-type.graphql";

export const CommentType: GraphQLOutputType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    userId: { type: UserType },
    postId: { type: PostType },
    parentId: { type: CommentType },
    mentions: { type: new GraphQLList(UserType) },
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

export const commentResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "CommentQuery",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    data: { type: CommentType },
  }),
});

export const commentsResponse: GraphQLOutputType = new GraphQLObjectType({
  name: "CommentsQuery",
  fields: () => ({
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    data: { type: new GraphQLList(CommentType) },
  }),
});
