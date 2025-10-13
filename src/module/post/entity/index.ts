import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utilities";

export class Post {
    userId: ObjectId;
    content: string;
    attachments?: IAttachment[];
    reactions?: IReaction[];
    mentions?: ObjectId[];
}