import { IUser } from "../../../utilities";
import { Post } from "../entity";
import { createPostDto, updatePostDto } from "../post.dto";
import { ObjectId } from "mongoose";

export default class PostFactoryService {
    createPost = (createPostDto: createPostDto, user: IUser, mentions?: ObjectId[]) => {
        const newPost = new Post()
        newPost.userId = user._id as unknown as ObjectId
        newPost.content = createPostDto.content
        newPost.reactions = []
        newPost.attachments = []
        newPost.mentions = mentions || []
        return newPost
    }
    updatePost = (updatePostDto: updatePostDto, post: Post, mentions?: ObjectId[]) => {
        if (updatePostDto.content) {
            post.content = updatePostDto.content
        }
        if (updatePostDto.attachments) {
            post.attachments = []
        }
        if (updatePostDto.mentions) {
            post.mentions = mentions || []
        }
        return post
    }
}
    