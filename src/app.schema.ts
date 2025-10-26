import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery } from "./module/user/graphql/query";
import { postQuery } from "./module/post/graphql/query";
import { commentQuery } from "./module/comment/graphql/query";
import { userMutation } from "./module/user/graphql/mutation";
import { postMutation } from "./module/post/graphql/mutation";
import { commentMutation } from "./module/comment/graphql/mutation";

const query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...userQuery,
        ...postQuery,
        ...commentQuery,
    }
})

const mutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        ...userMutation,
        ...postMutation,
        ...commentMutation,
    }
})

export const schema = new GraphQLSchema({
    query,
    mutation,
})