import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketIoAuth } from "./middleware";
import { chatSendMessage } from "./chat";

const connectedUsers = new Map<string, string>();

export const initSocketIo = (server: HttpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketIoAuth);
  io.on("connection", (socket: Socket) => {
    connectedUsers.set(socket.data.user.id, socket.id);

    socket.on("sendMessage", chatSendMessage(socket,io,connectedUsers));
  });
};
