"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactProvider = void 0;
const utilities_1 = require("../../../utilities");
const ReactProvider = async (repo, id, reaction, userId, doc) => {
    const docExists = await repo.exists({ _id: id });
    if (!docExists) {
        throw new utilities_1.NotFoundException(`${doc} not found`);
    }
    const userReactedIndex = docExists.reactions.findIndex((react) => react.userId.toString() === userId.toString());
    if (userReactedIndex == -1) {
        await repo.update({ _id: id }, {
            $push: {
                reactions: { reaction, userId },
            },
        });
    }
    else if ([null, undefined, ""].includes(reaction)) {
        await repo.update({ _id: id, "reactions.userId": userId }, { $pull: { reactions: docExists.reactions[userReactedIndex] } });
    }
    else {
        await repo.update({ _id: id, "reactions.userId": userId }, { $set: { "reactions.$.reaction": reaction } });
    }
};
exports.ReactProvider = ReactProvider;
