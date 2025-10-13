import cryptoJS from "crypto-js";
import devConfig from "../../env/dev.config";

const secretKey = cryptoJS.enc.Utf8.parse(devConfig.SECRET_KEY as string);
const iv = cryptoJS.enc.Utf8.parse(devConfig.IV as string);

export const cryptPhone = (phoneNumber: string) => {
  const encrypted = cryptoJS.AES.encrypt(phoneNumber, secretKey, { iv });
  return encrypted.toString();
};

export const decryptPhone = (cryptPhoneNumber: string) => {
  const decrypted = cryptoJS.AES.decrypt(cryptPhoneNumber, secretKey, { iv });
  return decrypted.toString(cryptoJS.enc.Utf8);
};