import { GraphQLID, GraphQLString } from "graphql";
import { createPost, deletePost, updatePost } from "./post-service.graphql";
import { postMutationResponse } from "./post-type.graphql";

export const postMutation = {
  createPost: {
    type: postMutationResponse,
    args: {
      content: { type: GraphQLString },
      attachments: { type: GraphQLString },
      mentions: { type: GraphQLString },
    },
    resolve: createPost,
  },
  updatePost: {
    type: postMutationResponse,
    args: {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      attachments: { type: GraphQLString },
      mentions: { type: GraphQLString },
    },
    resolve: updatePost,
  },
  deletePost: {
    type: postMutationResponse,
    args: {
      id: { type: GraphQLID },
    },
    resolve: deletePost,
  },
};
