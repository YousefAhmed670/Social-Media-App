import { ObjectId } from "mongoose";

export interface createPostDto {
    content: string;
    attachment?: any[];
    mentions?: ObjectId[];
}
    
export interface updatePostDto {
    content?: string;
    attachments?: any[];
    mentions?: ObjectId[];
}