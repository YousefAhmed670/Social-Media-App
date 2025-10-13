import { model } from "mongoose";
import { IBlackListToken } from "../../../utilities";
import tokenSchema from "./token.schema";

export const Token = model<IBlackListToken>("Token", tokenSchema);