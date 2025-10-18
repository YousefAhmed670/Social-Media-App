import { Socket } from "socket.io";
import { UserRepository } from "../../DB";
import {
  NotFoundException,
  UnauthorizedException,
  verifyToken,
} from "../../utilities";

export const socketIoAuth = async (socket: Socket, next: Function) => {
  try {
    const { authorization } = socket.handshake.auth;
    if (!authorization) {
      throw new UnauthorizedException("unauthorized");
    }
    const payload = verifyToken(authorization);
    const userRepository = new UserRepository();
    const user = await userRepository.getOne({ _id: payload._id });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    socket.data.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
