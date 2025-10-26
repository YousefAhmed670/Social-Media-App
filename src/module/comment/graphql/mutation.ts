import { GraphQLID, GraphQLString } from "graphql";
import { commentMutationResponse} from "./comment-type.graphql";
import {
  createComment,
  deleteComment,
  updateComment,
} from "./comment.service.graphql";

export const commentMutation = {
  createComment: {
    type: commentMutationResponse,
    args: { 
      postId: { type: GraphQLID },
      parentId: { type: GraphQLID },
      content: { type: GraphQLString },
      attachments: { type: GraphQLString },
      mentions: { type: GraphQLString },
    },
    resolve: createComment,
  },
  updateComment: {
    type: commentMutationResponse,
    args: {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      attachments: { type: GraphQLString },
      mentions: { type: GraphQLString },
    },
    resolve: updateComment,
  },
  deleteComment: {
    type: commentMutationResponse,
    args: {
      id: { type: GraphQLID },
    },
    resolve: deleteComment,
  },
};
