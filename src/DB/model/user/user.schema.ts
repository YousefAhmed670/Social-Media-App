import { Schema } from "mongoose";
import { IUser } from "../../../utilities/common/interface";
import * as utilities from "../../../utilities";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: function () {
        if (this.userAgent === utilities.USER_AGENT.Google) {
          return false;
        }
        return true;
      },
    },
    credentialUpdatedAt: Date,
    phoneNumber: String,
    role: {
      type: Number,
      enum: utilities.SYS_ROLE,
      default: utilities.SYS_ROLE.User,
    },
    gender: {
      type: Number,
      enum: utilities.GENDER,
      default: utilities.GENDER.Male,
    },
    userAgent: {
      type: Number,
      enum: utilities.USER_AGENT,
      default: utilities.USER_AGENT.Local,
    },
    otp: String,
    otpExpireAt: Date,
    isVerified: { type: Boolean, default: false },
    twoStepVerificationEnabled: { type: Boolean, default: false },
    twoStepVerificationSecret: String,
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
userSchema
  .virtual("fullName")
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (value: string) {
    this.firstName = value.split(" ")[0] as string;
    this.lastName = value.split(" ")[1] as string;
  });
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "userId",
});

export default userSchema;

userSchema.pre("save", async function (next) {
  if (this.userAgent != utilities.USER_AGENT.Google && this.isNew) {
    utilities.eventEmitter.emit("userRegistered", {
      email: this.email,
      otp: this.otp,
    });
    this.otp = await utilities.generateHash(this.otp as string);
  }
  next();
});
