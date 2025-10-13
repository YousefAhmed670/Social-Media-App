import { ObjectId } from "mongoose";

export interface createCommentDto {
    content: string;
    attachment?: any;
    mentions?: ObjectId[];
}