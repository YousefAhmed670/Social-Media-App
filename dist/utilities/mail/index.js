"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = __importDefault(require("../../env/dev.config"));
async function sendMail(mailOptions) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: dev_config_1.default.NODMAILER_USER,
            pass: dev_config_1.default.NODMAILER_PASSWORD,
        },
    });
    await transporter.sendMail(mailOptions);
}
