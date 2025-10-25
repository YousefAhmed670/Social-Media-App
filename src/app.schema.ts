import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery } from "./module/user/graphql/query";
import { postQuery } from "./module/post/graphql/query";
import { commentQuery } from "./module/comment/graphql/query";
const query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...userQuery,
        ...postQuery,
        ...commentQuery,
    }
})
const mutation = null;
export const schema = new GraphQLSchema({
    query,
    mutation,
})
    