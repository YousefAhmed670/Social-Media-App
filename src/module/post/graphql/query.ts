import { GraphQLID, GraphQLInt, GraphQLList } from "graphql";
import { getPosts, getSpecificPost } from "./post-service.graphql";
import { postResponse, postsResponse, PostType } from "./post-type.graphql";

export const postQuery = {
  post: {
    type: postResponse,
    args: { id: { type: GraphQLID } },
    resolve: getSpecificPost,
  },
  posts: {
    type: postsResponse,
    args: {
      id: { type: GraphQLID },
      count: { type: GraphQLInt },
      page: { type: GraphQLInt },
    },
    resolve: getPosts,
  },
};
