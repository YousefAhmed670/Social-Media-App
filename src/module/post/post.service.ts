import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { PostRepository, UserRepository } from "../../DB";
import {
  MentionProvider,
  NotFoundException,
  ReactProvider,
  UnauthorizedException,
} from "../../utilities";
import PostFactoryService from "./factory";
import { createPostDto, updatePostDto } from "./post.dto";

class PostService {
  private readonly postRepository = new PostRepository();
  private readonly postFactoryService = new PostFactoryService();
  private readonly userRepository = new UserRepository();
  constructor() {}

  create = async (req: Request, res: Response) => {
    const createPostDto: createPostDto = req.body;
    const user = req.user;
    let validatedMentions: ObjectId[] = [];
    if (createPostDto.mentions?.length) {
      validatedMentions = await MentionProvider(
        createPostDto.mentions as ObjectId[],
        user,
        this.userRepository
      );
    }
    const post = this.postFactoryService.createPost(
      createPostDto,
      user,
      validatedMentions
    );
    const createdPost = await this.postRepository.create(post);
    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      data: { createdPost },
    });
  };

  React = async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { id } = req.params;
    const { reaction } = req.body;
    await ReactProvider(
      this.postRepository,
      id as string,
      reaction as string,
      userId.toString(),
      "Post"
    );
    return res.sendStatus(204);
  };

  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await this.postRepository.exists(
      { _id: id },
      {},
      {
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
      }
    );
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return res.status(200).json({
      message: "Post found successfully",
      success: true,
      data: { post },
    });
  };

  updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatePostDto: updatePostDto = req.body;
    const user = req.user;
    const postExists = await this.postRepository.exists({ _id: id });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    if (postExists.userId.toString() !== user._id.toString()) {
      throw new UnauthorizedException(
        "You are not authorized to update this post"
      );
    }
    let validatedMentions: ObjectId[] = [];
    if (updatePostDto.mentions?.length) {
      validatedMentions = await MentionProvider(
        updatePostDto.mentions as ObjectId[],
        user,
        this.userRepository
      );
    }
    const updatedPost = this.postFactoryService.updatePost(
      updatePostDto,
      postExists,
      validatedMentions
    );
    await this.postRepository.update({ _id: id }, updatedPost);
    return res.status(200).json({
      message: "Post updated successfully",
      success: true,
      data: { updatedPost },
    });
  };

  deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const postExists = await this.postRepository.exists({ _id: id });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    if (postExists.userId.toString() !== user._id.toString()) {
      throw new UnauthorizedException(
        "You are not authorized to delete this post"
      );
    }
    await this.postRepository.delete({ _id: id });
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  };
}
export default new PostService();
