"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dev_config_1 = __importDefault(require("../../env/dev.config"));
const generateToken = ({ payload, secretKey = dev_config_1.default.JWT_SECRET, options = { expiresIn: "1h" }, }) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateToken = generateToken;
const verifyToken = (token, secretKey = dev_config_1.default.JWT_SECRET) => {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyToken = verifyToken;
const generateRefreshToken = ({ payload, secretKey = dev_config_1.default.JWT_REFRESH_SECRET, options = { expiresIn: "7d" }, }) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token, secretKey = dev_config_1.default.JWT_REFRESH_SECRET) => {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyRefreshToken = verifyRefreshToken;
