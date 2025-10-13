"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const events_1 = __importDefault(require("events"));
const mail_1 = require("../mail");
const dev_config_1 = __importDefault(require("../../env/dev.config"));
exports.eventEmitter = new events_1.default();
exports.eventEmitter.on("userRegistered", async ({ email, otp }) => {
    await (0, mail_1.sendMail)({
        to: email,
        from: `social-app <${dev_config_1.default.NODMAILER_USER}>`,
        subject: "register OTP",
        html: `<h2>your OTP is:</h2>
        <h1>${otp}</h1>
        <p>OTP will expire in 10 minutes</p>`,
    });
});
exports.eventEmitter.on("sendOTP", async ({ email, otp }) => {
    await (0, mail_1.sendMail)({
        to: email,
        from: `social-app <${dev_config_1.default.NODMAILER_USER}>`,
        subject: "send OTP",
        html: `<h2>your OTP is:</h2>
        <h1>${otp}</h1>
        <p>OTP will expire in 10 minutes</p>`,
    });
});
exports.eventEmitter.on("2StepLogin", async ({ email, secret }) => {
    await (0, mail_1.sendMail)({
        to: email,
        from: `social-app <${dev_config_1.default.NODMAILER_USER}>`,
        subject: "2-Step Login secret",
        html: `<h2>your secret code is:</h2>
        <h1>${secret}</h1>
        <p>Secret code will expire in 10 minutes</p>`,
    });
});
exports.eventEmitter.on("mentionNotification", async ({ email, message, userMail, }) => {
    await (0, mail_1.sendMail)({
        to: email,
        from: userMail,
        subject: "mention notification",
        html: `<h2>you have been mentioned in a post</h2>
      <p>${message}</p>`,
    });
});
