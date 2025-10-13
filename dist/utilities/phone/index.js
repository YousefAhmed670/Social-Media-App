"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPhone = exports.cryptPhone = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const dev_config_1 = __importDefault(require("../../env/dev.config"));
const secretKey = crypto_js_1.default.enc.Utf8.parse(dev_config_1.default.SECRET_KEY);
const iv = crypto_js_1.default.enc.Utf8.parse(dev_config_1.default.IV);
const cryptPhone = (phoneNumber) => {
    const encrypted = crypto_js_1.default.AES.encrypt(phoneNumber, secretKey, { iv });
    return encrypted.toString();
};
exports.cryptPhone = cryptPhone;
const decryptPhone = (cryptPhoneNumber) => {
    const decrypted = crypto_js_1.default.AES.decrypt(cryptPhoneNumber, secretKey, { iv });
    return decrypted.toString(crypto_js_1.default.enc.Utf8);
};
exports.decryptPhone = decryptPhone;
