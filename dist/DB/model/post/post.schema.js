"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const comment_model_1 = require("../comment/comment.model");
exports.PostSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    reactions: [common_1.reactionSchema],
    mentions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    isFrozen: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.PostSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId",
});
exports.PostSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    await comment_model_1.Comment.deleteMany({ postId: filter._id });
    next();
});
