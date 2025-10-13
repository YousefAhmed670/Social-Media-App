import { ObjectId } from "mongoose";
import { IComment, IPost, IUser } from "../../../utilities";
import { createCommentDto, updateCommentDto } from "../comment.dto";
import { Comment } from "../entity";

export default class CommentFactoryService {
  createComment = (
    createCommentDto: createCommentDto,
    user: IUser,
    post: IPost,
    comment?: IComment,
    mentions?: ObjectId[]
  ) => {
    const newComment = new Comment();
    newComment.userId = user._id;
    newComment.postId = post._id || comment!.postId;
    newComment.content = createCommentDto.content;
    newComment.parentId = comment?._id || null;
    newComment.reactions = [];
    newComment.mentions = mentions || [];
    return newComment;
  };

  updateComment = (
    updateCommentDto: updateCommentDto,
    comment: IComment,
    mentions?: ObjectId[]
  ) => {
    if (updateCommentDto.content !== undefined) {
      comment.content = updateCommentDto.content;
    }
    if (mentions !== undefined) {
      comment.mentions = mentions;
    }
    return comment;
  };
}
