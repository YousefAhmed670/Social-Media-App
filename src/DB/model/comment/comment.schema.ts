import { Schema } from "mongoose";
import { IComment } from "../../../utilities";
import { reactionSchema } from "../common";

export const CommentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: { type: String },
    reactions: [reactionSchema],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

CommentSchema.pre("deleteOne", async function (next) {
  const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
  const replies = await this.model.find({ parentId: filter._id });
  if (replies.length) {
    for (const reply of replies) {
      await this.model.deleteOne({ _id: reply._id });
    }
  }
  next();
});
