import { NextFunction, Request, Response } from "express";
import * as utilities from "../utilities";
import { TokenRepository, UserRepository } from "../DB";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new utilities.UnauthorizedException("Unauthorized");
  }
  const payload = utilities.verifyToken(token as string);
  if (!payload) {
    throw new utilities.UnauthorizedException("Unauthorized");
  }
  const userRepository = new UserRepository();
  const user = await userRepository.exists({ _id: payload._id });
  if (!user) {
    throw new utilities.NotFoundException("User not found");
  }
  const blackListTokenRepository = new TokenRepository();
  const blackListToken = await blackListTokenRepository.exists({
    userId: user._id,
    token,
    type: utilities.TOKEN_TYPE.Access,
  });
  if (blackListToken) {
    throw new utilities.UnauthorizedException("user logged out before");
  }
  if (user.credentialUpdatedAt > new Date(payload.iat! * 1000)) {
    throw new utilities.UnauthorizedException("token expired");
  }
  req.user = user;
  next();
};
