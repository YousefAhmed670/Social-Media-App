import { ObjectId } from "mongoose";
import { NotFoundException } from "../../error";
import { eventEmitter } from "../../events";
import { IUser } from "../interface";
import { UserRepository } from "../../../DB";

export const MentionProvider = async (
  mentions: ObjectId[],
  user: IUser,
  repo: UserRepository
) => {
  const validatedMentions: ObjectId[] = [];
    for (const mention of mentions) {
      const mentionedUser = await repo.exists({ _id: mention });
      if (!mentionedUser) {
        throw new NotFoundException("Mentioned User not found");
      }
      validatedMentions.push(mentionedUser._id);
      eventEmitter.emit("mentionNotification", {
        email: mentionedUser.email,
        from: user.email,
        message: `${user.firstName} ${user.lastName} mentioned you in a post`,
      });
    }
  return validatedMentions
};
