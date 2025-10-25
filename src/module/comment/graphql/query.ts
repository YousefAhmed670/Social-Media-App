import { GraphQLID, GraphQLInt } from "graphql";
import { commentResponse, commentsResponse } from "./comment-type.graphql";
import { getComment, getComments } from "./comment.service.graphql";

export const commentQuery = {
  comment: {
    type: commentResponse,
    args: { id: { type: GraphQLID } },
    resolve: getComment,
  },
  comments: {
    type: commentsResponse,
    args: {
      id: { type: GraphQLID },
      count: { type: GraphQLInt },
      page: { type: GraphQLInt },
    },
    resolve: getComments,
  },
};
