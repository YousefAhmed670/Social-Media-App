import { CommentRepository, PostRepository } from "../../../DB";
import { NotFoundException } from "../../../utilities";

export const ReactProvider = async (
  repo: PostRepository | CommentRepository,
  id: string,
  reaction: string,
  userId: string,
  doc: string
) => {
  const docExists = await repo.exists({ _id: id });
  if (!docExists) {
    throw new NotFoundException(`${doc} not found`);
  }
  const userReactedIndex = docExists.reactions.findIndex(
    (react) => react.userId.toString() === userId.toString()
  );
  if (userReactedIndex == -1) {
    await repo.update(
      { _id: id },
      {
        $push: {
          reactions: { reaction, userId },
        },
      }
    );
  } else if ([null, undefined, ""].includes(reaction)) {
    await repo.update(
      { _id: id, "reactions.userId": userId },
      { $pull: { reactions: docExists.reactions[userReactedIndex] } }
    );
  } else {
    await repo.update(
      { _id: id, "reactions.userId": userId },
      { $set: { "reactions.$.reaction": reaction } }
    );
  }
};
