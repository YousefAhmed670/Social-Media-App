import { Schema } from "mongoose";
import * as utilities from "../../../utilities";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";
export const PostSchema = new Schema<utilities.IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      // required: function () {
      //   if (this.attachments?.length) return false;
      //   return true;
      // },
      trim: true,
    },
    reactions: [reactionSchema],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

PostSchema.pre("deleteOne", async function (next) {
  const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
  await Comment.deleteMany({ postId: filter._id });
  next();
});
