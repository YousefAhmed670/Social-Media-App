import { config } from "dotenv";
config();
export default {
  DB_URL: process.env.DB_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  IV: process.env.IV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  NODMAILER_USER: process.env.NODMAILER_USER,
  NODMAILER_PASSWORD: process.env.NODMAILER_PASSWORD,
};
