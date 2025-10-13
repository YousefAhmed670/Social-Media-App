"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const utilities = __importStar(require("../../../utilities"));
const userSchema = new mongoose_1.Schema({
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
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
userSchema
    .virtual("fullName")
    .get(function () {
    return `${this.firstName} ${this.lastName}`;
})
    .set(function (value) {
    this.firstName = value.split(" ")[0];
    this.lastName = value.split(" ")[1];
});
userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "userId",
});
exports.default = userSchema;
userSchema.pre("save", async function (next) {
    if (this.userAgent != utilities.USER_AGENT.Google && this.isNew) {
        utilities.eventEmitter.emit("userRegistered", {
            email: this.email,
            otp: this.otp,
        });
        this.otp = await utilities.generateHash(this.otp);
    }
    next();
});
