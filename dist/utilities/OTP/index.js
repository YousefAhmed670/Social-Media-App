"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpiryTime = exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(Math.random() * 900000 + 100000).toString();
};
exports.generateOTP = generateOTP;
const generateExpiryTime = (minutes) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};
exports.generateExpiryTime = generateExpiryTime;
