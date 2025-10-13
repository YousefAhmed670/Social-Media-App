import * as utilities from "../../../utilities";
import { RegisterDTO } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {
  async registerFactory(registerDto: RegisterDTO): Promise<User> {
    const user = new User();
    user.fullName = registerDto.fullName as string;
    user.email = registerDto.email as string;
    user.password = await utilities.generateHash(registerDto.password);
    user.phoneNumber = utilities.cryptPhone(registerDto.phoneNumber as string);
    user.role = utilities.SYS_ROLE.User;
    user.gender = registerDto.gender as utilities.GENDER;
    user.userAgent = utilities.USER_AGENT.Local;
    user.credentialUpdatedAt = new Date();
    user.otp = utilities.generateOTP();
    user.otpExpireAt = utilities.generateExpiryTime(10);
    user.isVerified = false;
    return user;
  }
}
