"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../entity");
class CommentFactoryService {
    createComment = (createCommentDto, user, post, comment, mentions) => {
        const newComment = new entity_1.Comment();
        newComment.userId = user._id;
        newComment.postId = post._id || comment.postId;
        newComment.content = createCommentDto.content;
        newComment.parentId = comment?._id || null;
        newComment.reactions = [];
        newComment.mentions = mentions || [];
        return newComment;
    };
}
exports.default = CommentFactoryService;
