"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utilities_1 = require("../../utilities");
const react_provider_1 = require("../../utilities/common/provider/react.provider");
const factory_1 = __importDefault(require("./factory"));
class CommentService {
    postRepository = new DB_1.PostRepository();
    commentRepository = new DB_1.CommentRepository();
    commentFactoryService = new factory_1.default();
    userRepository = new DB_1.UserRepository();
    constructor() { }
    create = async (req, res) => {
        const { postId, id } = req.params;
        const createCommentDto = req.body;
        const postExists = await this.postRepository.exists({ _id: postId });
        if (!postExists) {
            throw new utilities_1.NotFoundException("Post not found");
        }
        let commentExists;
        if (id) {
            commentExists = await this.commentRepository.exists({ _id: id });
            if (!commentExists) {
                throw new utilities_1.NotFoundException("Comment not found");
            }
        }
        let validatedMentions = [];
        if (createCommentDto.mentions?.length) {
            validatedMentions = await (0, utilities_1.MentionProvider)(createCommentDto.mentions, req.user, this.userRepository);
        }
        const comment = this.commentFactoryService.createComment(createCommentDto, req.user, postExists, commentExists, validatedMentions);
        const createdComment = await this.commentRepository.create(comment);
        res.status(201).json({
            message: "Comment created successfully",
            success: true,
            data: { createdComment },
        });
    };
    react = async (req, res) => {
        const userId = req.user._id;
        const { id } = req.params;
        const { reaction } = req.body;
        await (0, react_provider_1.ReactProvider)(this.commentRepository, id, reaction, userId.toString(), "Comment");
        return res.sendStatus(204);
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const commentExists = await this.commentRepository.exists({ _id: id }, {}, {
            populate: [
                {
                    path: "replies",
                    select: "userId postId parentId content reactions",
                    populate: [
                        {
                            path: "userId",
                            select: "fullName firstName lastName",
                        },
                    ],
                },
            ],
        });
        if (!commentExists) {
            throw new utilities_1.NotFoundException("Comment not found");
        }
        res.status(200).json({
            message: "Comment found successfully",
            success: true,
            data: { commentExists },
        });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        const commentExists = await this.commentRepository.exists({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }],
        });
        if (!commentExists) {
            throw new utilities_1.NotFoundException("Comment not found");
        }
        if (commentExists.userId.toString() !== user._id.toString() &&
            commentExists.postId.userId.toString() !==
                user._id.toString()) {
            throw new utilities_1.UnauthorizedException("You are not authorized to delete this comment");
        }
        await this.commentRepository.delete({ _id: id });
        res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
        });
    };
}
exports.default = new CommentService();
