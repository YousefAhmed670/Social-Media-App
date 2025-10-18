"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketIo = void 0;
const socket_io_1 = require("socket.io");
const chat_1 = require("./chat");
const middleware_1 = require("./middleware");
const connectedUsers = new Map();
const initSocketIo = (server) => {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.use(middleware_1.socketIoAuth);
    io.on("connection", (socket) => {
        connectedUsers.set(socket.data.user.id, socket.id);
        const onlineUserIds = Array.from(connectedUsers.keys());
        socket.emit("onlineUsers", onlineUserIds);
        socket.broadcast.emit("userConnected", socket.data.user);
        socket.on("sendMessage", (0, chat_1.chatSendMessage)(socket, io, connectedUsers));
        socket.on("disconnect", () => {
            connectedUsers.delete(socket.data.user.id);
            socket.broadcast.emit("userDisconnected", socket.data.user);
        });
    });
};
exports.initSocketIo = initSocketIo;
