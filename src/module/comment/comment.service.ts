import { Request, Response } from "express";
import { CommentRepository, PostRepository, UserRepository } from "../../DB";
import {
  IPost,
  MentionProvider,
  NotFoundException,
  UnauthorizedException,
} from "../../utilities";
import { ReactProvider } from "../../utilities/common/provider/react.provider";
import { createCommentDto } from "./comment.dto";
import CommentFactoryService from "./factory";
import { ObjectId } from "mongoose";

class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  private readonly userRepository = new UserRepository();
  constructor() {}

  create = async (req: Request, res: Response) => {
    const { postId, id } = req.params;
    const createCommentDto: createCommentDto = req.body;
    const postExists = await this.postRepository.exists({ _id: postId });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    let commentExists;
    if (id) {
      commentExists = await this.commentRepository.exists({ _id: id });
      if (!commentExists) {
        throw new NotFoundException("Comment not found");
      }
    }
    let validatedMentions: ObjectId[] = [];
    if (createCommentDto.mentions?.length) {
      validatedMentions = await MentionProvider(
        createCommentDto.mentions as ObjectId[],
        req.user,
        this.userRepository
      );
    }
    const comment = this.commentFactoryService.createComment(
      createCommentDto,
      req.user,
      postExists,
      commentExists,
      validatedMentions
    );
    const createdComment = await this.commentRepository.create(comment);
    res.status(201).json({
      message: "Comment created successfully",
      success: true,
      data: { createdComment },
    });
  };

  react = async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { id } = req.params;
    const { reaction } = req.body;
    await ReactProvider(
      this.commentRepository,
      id as string,
      reaction as string,
      userId.toString(),
      "Comment"
    );
    return res.sendStatus(204);
  };

  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commentExists = await this.commentRepository.exists(
      { _id: id },
      {},
      {
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
      }
    );
    if (!commentExists) {
      throw new NotFoundException("Comment not found");
    }
    res.status(200).json({
      message: "Comment found successfully",
      success: true,
      data: { commentExists },
    });
  };

  deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const commentExists = await this.commentRepository.exists(
      { _id: id },
      {},
      {
        populate: [{ path: "postId", select: "userId" }],
      }
    );
    if (!commentExists) {
      throw new NotFoundException("Comment not found");
    }
    if (
      commentExists.userId.toString() !== user._id.toString() &&
      (commentExists.postId as unknown as IPost).userId.toString() !==
        user._id.toString()
    ) {
      throw new UnauthorizedException(
        "You are not authorized to delete this comment"
      );
    }
    await this.commentRepository.delete({ _id: id });
    res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  };
}

export default new CommentService();
