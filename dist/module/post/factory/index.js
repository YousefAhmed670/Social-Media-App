"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../entity");
class PostFactoryService {
    createPost = (createPostDto, user, mentions) => {
        const newPost = new entity_1.Post();
        newPost.userId = user._id;
        newPost.content = createPostDto.content;
        newPost.reactions = [];
        newPost.attachments = [];
        newPost.mentions = mentions || [];
        return newPost;
    };
    updatePost = (updatePostDto, post, mentions) => {
        if (updatePostDto.content) {
            post.content = updatePostDto.content;
        }
        if (updatePostDto.attachments) {
            post.attachments = [];
        }
        if (updatePostDto.mentions) {
            post.mentions = mentions || [];
        }
        return post;
    };
}
exports.default = PostFactoryService;
