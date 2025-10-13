import jwt, { SignOptions } from "jsonwebtoken";
import devConfig from "../../env/dev.config";
import { IPayload } from "../common";
export const generateToken = ({
  payload,
  secretKey = devConfig.JWT_SECRET as string,
  options = { expiresIn: "1h" },
}: {
  payload: object;
  secretKey?: string;
  options?: SignOptions;
}) => {
  return jwt.sign(payload, secretKey, options);
};
export const verifyToken = (
  token: string,
  secretKey: string = devConfig.JWT_SECRET as string
) => {
  return jwt.verify(token, secretKey) as IPayload;
};
export const generateRefreshToken = ({
  payload,
  secretKey = devConfig.JWT_REFRESH_SECRET as string,
  options = { expiresIn: "7d" },
}: {
  payload: object;
  secretKey?: string;
  options?: SignOptions;
}) => {
  return jwt.sign(payload, secretKey, options);
};
export const verifyRefreshToken = (
  token: string,
  secretKey: string = devConfig.JWT_REFRESH_SECRET as string
) => {
  return jwt.verify(token, secretKey) as IPayload;
};