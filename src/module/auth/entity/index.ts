import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utilities";

export class User {
    fullName?: string;
    email!: string;
    password!: string;
    credentialUpdatedAt!: Date;
    phoneNumber?: string;
    role!: SYS_ROLE;
    gender!: GENDER;
    userAgent!: USER_AGENT;
    otp!: string;
    otpExpireAt!: Date;
    isVerified!: boolean;
}