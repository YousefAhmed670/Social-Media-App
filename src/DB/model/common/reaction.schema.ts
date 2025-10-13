import { Schema } from "mongoose";
import * as utilities from "../../../utilities";

export const reactionSchema = new Schema<utilities.IReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: Number,
      enum: utilities.REACTION,
      set: (v) => Number(v) || utilities.REACTION.Like,
    },
  },
  { timestamps: true }
);
