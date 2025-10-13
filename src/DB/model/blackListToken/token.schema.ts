import { Schema } from "mongoose";
import { IBlackListToken } from "../../../utilities";

const tokenSchema = new Schema<IBlackListToken>(
  { userId: String, token: String, type: String },
  { timestamps: true }
);

export default tokenSchema;
