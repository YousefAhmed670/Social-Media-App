import EventEmitter from "events";
import { sendMail } from "../mail";
import devConfig from "../../env/dev.config";
export const eventEmitter = new EventEmitter();
eventEmitter.on(
  "userRegistered",
  async ({ email, otp }: { email: string; otp: string }) => {
    await sendMail({
      to: email,
      from: `social-app <${devConfig.NODMAILER_USER}>`,
      subject: "register OTP",
      html: `<h2>your OTP is:</h2>
        <h1>${otp}</h1>
        <p>OTP will expire in 10 minutes</p>`,
    });
  }
);
eventEmitter.on(
  "sendOTP",
  async ({ email, otp }: { email: string; otp: string }) => {
    await sendMail({
      to: email,
      from: `social-app <${devConfig.NODMAILER_USER}>`,
      subject: "send OTP",
      html: `<h2>your OTP is:</h2>
        <h1>${otp}</h1>
        <p>OTP will expire in 10 minutes</p>`,
    });
  }
);
eventEmitter.on(
  "2StepLogin",
  async ({ email, secret }: { email: string; secret: string }) => {
    await sendMail({
      to: email,
      from: `social-app <${devConfig.NODMAILER_USER}>`,
      subject: "2-Step Login secret",
      html: `<h2>your secret code is:</h2>
        <h1>${secret}</h1>
        <p>Secret code will expire in 10 minutes</p>`,
    });
  }
);
eventEmitter.on(
  "mentionNotification",
  async ({
    email,
    message,
    userMail,
  }: {
    email: string;
    message: string;
    userMail: string;
  }) => {
    await sendMail({
      to: email,
      from: userMail,
      subject: "mention notification",
      html: `<h2>you have been mentioned in a post</h2>
      <p>${message}</p>`,
    });
  }
);
