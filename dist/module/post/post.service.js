"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utilities_1 = require("../../utilities");
const factory_1 = __importDefault(require("./factory"));
class PostService {
    postRepository = new DB_1.PostRepository();
    postFactoryService = new factory_1.default();
    userRepository = new DB_1.UserRepository();
    constructor() { }
    create = async (req, res) => {
        const createPostDto = req.body;
        const user = req.user;
        let validatedMentions = [];
        if (createPostDto.mentions?.length) {
            validatedMentions = await (0, utilities_1.MentionProvider)(createPostDto.mentions, user, this.userRepository);
        }
        const post = this.postFactoryService.createPost(createPostDto, user, validatedMentions);
        const createdPost = await this.postRepository.create(post);
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            data: { createdPost },
        });
    };
    React = async (req, res) => {
        const userId = req.user._id;
        const { id } = req.params;
        const { reaction } = req.body;
        await (0, utilities_1.ReactProvider)(this.postRepository, id, reaction, userId.toString(), "Post");
        return res.sendStatus(204);
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const post = await this.postRepository.exists({ _id: id }, {}, {
            populate: [
                {
                    path: "userId",
                    select: "fullName firstName lastName",
                },
                {
                    path: "reactions.userId",
                    select: "fullName firstName lastName",
                },
                {
                    path: "comments",
                    match: { parentId: null },
                    populate: [
                        {
                            path: "userId",
                            select: "fullName firstName lastName",
                        },
                    ],
                },
            ],
        });
        if (!post) {
            throw new utilities_1.NotFoundException("Post not found");
        }
        return res.status(200).json({
            message: "Post found successfully",
            success: true,
            data: { post },
        });
    };
    updatePost = async (req, res) => {
        const { id } = req.params;
        const updatePostDto = req.body;
        const user = req.user;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new utilities_1.NotFoundException("Post not found");
        }
        if (postExists.userId.toString() !== user._id.toString()) {
            throw new utilities_1.UnauthorizedException("You are not authorized to update this post");
        }
        let validatedMentions = [];
        if (updatePostDto.mentions?.length) {
            validatedMentions = await (0, utilities_1.MentionProvider)(updatePostDto.mentions, user, this.userRepository);
        }
        const updatedPost = this.postFactoryService.updatePost(updatePostDto, postExists, validatedMentions);
        await this.postRepository.update({ _id: id }, updatedPost);
        return res.status(200).json({
            message: "Post updated successfully",
            success: true,
            data: { updatedPost },
        });
    };
    deletePost = async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new utilities_1.NotFoundException("Post not found");
        }
        if (postExists.userId.toString() !== user._id.toString()) {
            throw new utilities_1.UnauthorizedException("You are not authorized to delete this post");
        }
        await this.postRepository.delete({ _id: id });
        return res.status(200).json({
            message: "Post deleted successfully",
            success: true,
        });
    };
}
exports.default = new PostService();
