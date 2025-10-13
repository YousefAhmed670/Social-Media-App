import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { GENDER, REACTION, SYS_ROLE, TOKEN_TYPE, USER_AGENT } from "../enum";

export interface IUser {
  readonly _id: ObjectId;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  credentialUpdatedAt: Date;
  phoneNumber?: string;
  role: SYS_ROLE;
  gender: GENDER;
  userAgent: USER_AGENT;
  otp?: string;
  otpExpireAt?: Date;
  isVerified?: boolean;
  twoStepVerificationEnabled?: boolean;
  twoStepVerificationSecret?: string;
}

export interface IReaction {
  userId: ObjectId;
  reaction: REACTION;
}

export interface IAttachment {
  id: string;
  url: string;
}

export interface IPost {
  readonly _id: ObjectId;
  userId: ObjectId;
  content: string;
  reactions: IReaction[];
  attachments?: IAttachment[];
  mentions?: ObjectId[];
}

export interface IComment {
  readonly _id: ObjectId;
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId | null;
  content: string;
  attachments?: IAttachment[];
  reactions: IReaction[];
  mentions?: ObjectId[];
}

export interface IBlackListToken {
  userId: ObjectId;
  token: string;
  type: TOKEN_TYPE;
}

export interface IPayload extends JwtPayload {
  readonly _id: ObjectId;
  userAgent: USER_AGENT;
  role: SYS_ROLE;
}

declare module "express" {
  interface Request {
    user: IUser;
  }
}
