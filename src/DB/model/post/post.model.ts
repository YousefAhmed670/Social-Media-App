import { model } from "mongoose";
import { PostSchema } from "./post.schema";
import { IPost } from "../../../utilities/common/interface";

export const Post = model<IPost>("Post", PostSchema);