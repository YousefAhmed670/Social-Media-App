import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { chatSendMessage } from "./chat";
import { socketIoAuth } from "./middleware";

const connectedUsers = new Map<string, string>();

export const initSocketIo = (server: HttpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketIoAuth);
  io.on("connection", (socket: Socket) => {
    connectedUsers.set(socket.data.user.id, socket.id);
    const onlineUserIds = Array.from(connectedUsers.keys());
    socket.emit("onlineUsers", onlineUserIds);
    socket.broadcast.emit("userConnected", socket.data.user);
    socket.on("sendMessage", chatSendMessage(socket, io, connectedUsers));
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.data.user.id);
      socket.broadcast.emit("userDisconnected", socket.data.user);
    });
  });
};
