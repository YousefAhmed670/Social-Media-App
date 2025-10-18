import { Schema } from "mongoose";
import { IChatMessage } from "../../../utilities";

export const messageSchema = new Schema<IChatMessage>(
  {
    content: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [],
    reactions: [],
  },
  { timestamps: true }
);
