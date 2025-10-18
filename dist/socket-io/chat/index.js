"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSendMessage = void 0;
const DB_1 = require("../../DB");
const chatSendMessage = (socket, io, connectedUsers) => {
    return async (data) => {
        const destSocketId = connectedUsers.get(data.destId);
        if (!destSocketId) {
            socket.emit("errorMessage", "User not found");
            return;
        }
        socket.emit("successMessage", data);
        io.to(destSocketId).emit("receiveMessage", data);
        const messageRepository = new DB_1.MessageRepository();
        const sender = socket.data.user.id;
        const createdMessage = await messageRepository.create({
            content: data.message,
            sender,
        });
        const chatRepository = new DB_1.ChatRepository();
        const chat = await chatRepository.getOne({
            users: { $all: [sender, data.destId] },
        });
        if (!chat) {
            const newChat = await chatRepository.create({
                users: [sender, data.destId],
                messages: [createdMessage._id],
            });
        }
        else {
            await chatRepository.update({ _id: chat._id }, {
                $push: { messages: createdMessage._id },
            });
        }
    };
};
exports.chatSendMessage = chatSendMessage;
