"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
class ChatService {
    chatRepository = new DB_1.ChatRepository();
    getChat = async (req, res) => {
        const { userId } = req.params;
        const userLoginId = req.user._id;
        console.log("req.user", req.user);
        const chat = await this.chatRepository.getOne({ users: { $all: [userLoginId, userId] } }, {}, {
            populate: [
                { path: "users", select: "fullName firstName lastName" },
                {
                    path: "messages",
                    populate: { path: "sender", select: "fullName firstName lastName" },
                    select: "content sender",
                },
            ],
        });
        return res.status(200).json({
            message: "done",
            success: true,
            data: { chat },
        });
    };
}
exports.default = new ChatService();
