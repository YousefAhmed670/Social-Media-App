import { Server, Socket } from "socket.io";
import { ChatRepository, MessageRepository } from "../../DB";

export const chatSendMessage = (
  socket: Socket,
  io: Server,
  connectedUsers: Map<string, string>
) => {
  return async (data: { message: string; destId: string }) => {
    const destSocketId = connectedUsers.get(data.destId);
    if (!destSocketId) {
      socket.emit("errorMessage", "User not found");
      return;
    }
    socket.emit("successMessage", data);
    io.to(destSocketId).emit("receiveMessage", data);

    const messageRepository = new MessageRepository();
    const sender = socket.data.user.id;
    const createdMessage = await messageRepository.create({
      content: data.message,
      sender,
    });
    const chatRepository = new ChatRepository();
    const chat = await chatRepository.getOne({
      users: { $all: [sender, data.destId] },
    });
    if (!chat) {
      const newChat = await chatRepository.create({
        users: [sender, data.destId],
        messages: [createdMessage._id],
      });
    } else {
      await chatRepository.update({ _id: chat._id }, {
        $push: { messages: createdMessage._id },
      });
    }
  };
};
