import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utilities";

export class Comment {
    userId: ObjectId;
    postId: ObjectId;
    parentId: ObjectId | null;
    content: string;
    attachments: IAttachment[];
    reactions: IReaction[];
    mentions?: ObjectId[];
}