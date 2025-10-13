"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionProvider = void 0;
const error_1 = require("../../error");
const events_1 = require("../../events");
const MentionProvider = async (mentions, user, repo) => {
    const validatedMentions = [];
    for (const mention of mentions) {
        const mentionedUser = await repo.exists({ _id: mention });
        if (!mentionedUser) {
            throw new error_1.NotFoundException("Mentioned User not found");
        }
        validatedMentions.push(mentionedUser._id);
        events_1.eventEmitter.emit("mentionNotification", {
            email: mentionedUser.email,
            from: user.email,
            message: `${user.firstName} ${user.lastName} mentioned you in a post`,
        });
    }
    return validatedMentions;
};
exports.MentionProvider = MentionProvider;
