"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIoAuth = void 0;
const DB_1 = require("../../DB");
const utilities_1 = require("../../utilities");
const socketIoAuth = async (socket, next) => {
    try {
        const { authorization } = socket.handshake.auth;
        if (!authorization) {
            throw new utilities_1.UnauthorizedException("unauthorized");
        }
        const payload = (0, utilities_1.verifyToken)(authorization);
        const userRepository = new DB_1.UserRepository();
        const user = await userRepository.getOne({ _id: payload._id });
        if (!user) {
            throw new utilities_1.NotFoundException("user not found");
        }
        socket.data.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.socketIoAuth = socketIoAuth;
