import { UserRepository } from "../../../DB";
import * as utilities from "../../../utilities";

export const AuthProvider = {
  async checkOTP(email: string, otp: string) {
    const userRepository = new UserRepository();
    const userExist = await userRepository.exists({ email });
    if (!userExist) {
      throw new utilities.NotFoundException("User not found");
    }
    if (
      userExist?.otpExpireAt &&
      userExist.otpExpireAt.getTime() < Date.now()
    ) {
      throw new utilities.BadRequestException("OTP expired");
    }
    if (!userExist.otp || !(await utilities.compareHash(otp, userExist.otp))) {
      throw new utilities.BadRequestException("Invalid OTP");
    }
  },
};
