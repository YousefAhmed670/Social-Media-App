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
const DB_1 = require("../../DB");
const utilities = __importStar(require("../../utilities"));
class UserService {
    userRepository = new DB_1.UserRepository();
    tokenRepository = new DB_1.TokenRepository();
    constructor() { }
    getProfile = async (req, res) => {
        const user = req.user;
        const userExists = await this.userRepository.getOne({ _id: req.params.id }, {}, {
            populate: [
                {
                    path: "posts",
                    populate: [
                        {
                            path: "userId",
                            select: "fullName firstName lastName",
                        },
                        {
                            path: "reactions.userId",
                            select: "fullName firstName lastName",
                        },
                        {
                            path: "comments",
                            match: { parentIds: [] },
                            populate: [
                                {
                                    path: "userId",
                                    select: "fullName firstName lastName",
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        if (!userExists) {
            throw new utilities.NotFoundException("User not found");
        }
        return res.status(200).json({
            message: "User profile retrieved successfully",
            success: true,
            data: { userExists },
        });
    };
    updatePassword = async (req, res) => {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = req.user;
        if (!user.password) {
            throw new utilities.BadRequestException("Cannot update password for social login users");
        }
        const isPasswordValid = await utilities.compareHash(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new utilities.BadRequestException("Current password is incorrect");
        }
        if (newPassword !== confirmPassword) {
            throw new utilities.BadRequestException("Passwords do not match");
        }
        const hashedPassword = await utilities.generateHash(newPassword);
        await this.userRepository.update({ _id: user._id }, { password: hashedPassword, credentialUpdatedAt: new Date() });
        await this.tokenRepository.delete({
            userId: user._id,
            type: utilities.TOKEN_TYPE.Refresh,
        });
        return res.status(200).json({
            message: "Password updated successfully",
            success: true,
        });
    };
    updateBasicInfo = async (req, res) => {
        const updateData = req.body;
        const user = req.user;
        if (!updateData.firstName &&
            !updateData.lastName &&
            !updateData.phoneNumber &&
            !updateData.gender) {
            throw new utilities.BadRequestException("No data provided to update");
        }
        await this.userRepository.update({ _id: user._id }, updateData);
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
        });
    };
    requestEmailUpdate = async (req, res) => {
        const { newEmail } = req.body;
        const user = req.user;
        const emailExists = await this.userRepository.exists({ email: newEmail });
        if (emailExists) {
            throw new utilities.ConflictException("Email already in use");
        }
        const OTP = utilities.generateOTP();
        const otpExpireAt = utilities.generateExpiryTime(10);
        const hashedOTP = await utilities.generateHash(OTP);
        await this.userRepository.update({ _id: user._id }, { otp: hashedOTP, otpExpireAt });
        utilities.eventEmitter.emit("sendOTP", {
            email: newEmail,
            otp: OTP,
        });
        return res.status(200).json({
            message: "OTP sent to your new email",
            success: true,
        });
    };
    updateEmail = async (req, res) => {
        const { newEmail, otp } = req.body;
        const user = req.user;
        if (!user.otp || !user.otpExpireAt) {
            throw new utilities.BadRequestException("No OTP found. Please request email update first");
        }
        if (user.otpExpireAt.getTime() < Date.now()) {
            throw new utilities.BadRequestException("OTP has expired");
        }
        const isOTPValid = await utilities.compareHash(otp, user.otp);
        if (!isOTPValid) {
            throw new utilities.BadRequestException("Invalid OTP");
        }
        const emailExists = await this.userRepository.exists({ email: newEmail });
        if (emailExists) {
            throw new utilities.ConflictException("Email already in use");
        }
        await this.userRepository.update({ _id: user._id }, {
            email: newEmail,
            credentialUpdatedAt: new Date(),
            $unset: { otp: "", otpExpireAt: "" },
        });
        return res.status(200).json({
            message: "Email updated successfully",
            success: true,
        });
    };
    request2StepVerification = async (req, res) => {
        const { password } = req.body;
        const user = req.user;
        if (user.twoStepVerificationEnabled) {
            throw new utilities.BadRequestException("Two-step verification is already enabled");
        }
        if (!user.password) {
            throw new utilities.BadRequestException("Cannot enable 2-step verification for social login users");
        }
        const isPasswordValid = await utilities.compareHash(password, user.password);
        if (!isPasswordValid) {
            throw new utilities.BadRequestException("Invalid password");
        }
        const OTP = utilities.generateOTP();
        const otpExpireAt = utilities.generateExpiryTime(10);
        const hashedOTP = await utilities.generateHash(OTP);
        await this.userRepository.update({ _id: user._id }, { otp: hashedOTP, otpExpireAt });
        utilities.eventEmitter.emit("sendOTP", {
            email: user.email,
            otp: OTP,
        });
        return res.status(200).json({
            message: "OTP sent to your email. Please verify to enable 2-step verification",
            success: true,
        });
    };
    enable2StepVerification = async (req, res) => {
        const { otp } = req.body;
        const user = req.user;
        if (!user.otp || !user.otpExpireAt) {
            throw new utilities.BadRequestException("No 2-step verification request found");
        }
        if (user.otpExpireAt.getTime() < Date.now()) {
            throw new utilities.BadRequestException("OTP has expired");
        }
        const isOTPValid = await utilities.compareHash(otp, user.otp);
        if (!isOTPValid) {
            throw new utilities.BadRequestException("Invalid OTP");
        }
        const secret = utilities.generateOTP();
        const otpExpireAt = utilities.generateExpiryTime(10);
        const twoStepVerificationSecret = await utilities.generateHash(secret);
        utilities.eventEmitter.emit("2StepLogin", {
            email: user.email,
            secret,
        });
        await this.userRepository.update({ _id: user._id }, {
            twoStepVerificationEnabled: true,
            twoStepVerificationSecret,
            $unset: { otp: "", otpExpireAt: "" },
        });
        return res.status(200).json({
            message: "Two-step verification enabled successfully",
            success: true,
            data: { "2-Step-Verification-Secret": secret },
        });
    };
    disable2StepVerificationRequest = async (req, res) => {
        const { password } = req.body;
        const user = req.user;
        if (!user.password) {
            throw new utilities.BadRequestException("Cannot disable 2-step verification for social login users");
        }
        const isPasswordValid = await utilities.compareHash(password, user.password);
        if (!isPasswordValid) {
            throw new utilities.BadRequestException("Invalid password");
        }
        const OTP = utilities.generateOTP();
        const otpExpireAt = utilities.generateExpiryTime(10);
        const hashedOTP = await utilities.generateHash(OTP);
        await this.userRepository.update({ _id: user._id }, { otp: hashedOTP, otpExpireAt });
        utilities.eventEmitter.emit("sendOTP", {
            email: user.email,
            otp: OTP,
        });
        return res.status(200).json({
            message: "OTP sent to your email. Please verify to disable 2-step verification",
            success: true,
        });
    };
    disable2StepVerification = async (req, res) => {
        const { password, otp } = req.body;
        const user = req.user;
        if (!user.twoStepVerificationEnabled) {
            throw new utilities.BadRequestException("Two-step verification is not enabled");
        }
        if (!user.password) {
            throw new utilities.BadRequestException("Cannot disable 2-step verification for social login users");
        }
        const isPasswordValid = await utilities.compareHash(password, user.password);
        if (!isPasswordValid) {
            throw new utilities.BadRequestException("Invalid password");
        }
        if (!user.otp || !user.otpExpireAt) {
            throw new utilities.BadRequestException("Please request 2-step verification first");
        }
        if (user.otpExpireAt.getTime() < Date.now()) {
            throw new utilities.BadRequestException("OTP has expired");
        }
        const isOTPValid = await utilities.compareHash(otp, user.otp);
        if (!isOTPValid) {
            throw new utilities.BadRequestException("Invalid OTP");
        }
        await this.userRepository.update({ _id: user._id }, {
            twoStepVerificationEnabled: false,
            $unset: { twoStepVerificationSecret: "", otp: "", otpExpireAt: "" },
        });
        return res.status(200).json({
            message: "Two-step verification disabled successfully",
            success: true,
        });
    };
    blockUser = async (req, res) => {
        const { userId } = req.body;
        const user = req.user;
        if (userId === user._id.toString()) {
            throw new utilities.BadRequestException("You cannot block yourself");
        }
        const userToBlock = await this.userRepository.exists({ _id: userId });
        if (!userToBlock) {
            throw new utilities.NotFoundException("User not found");
        }
        const blockedUsers = user.blockedUsers || [];
        const isBlocked = blockedUsers.some((blockedUserId) => blockedUserId.toString() === userId);
        if (isBlocked) {
            await this.userRepository.update({ _id: user._id }, { $pull: { blockedUsers: userId } });
            return res.status(200).json({
                message: "User unblocked successfully",
                success: true,
            });
        }
        else {
            await this.userRepository.update({ _id: user._id }, { $addToSet: { blockedUsers: userId } });
            return res.status(200).json({
                message: "User blocked successfully",
                success: true,
            });
        }
    };
    sendFriendRequest = async (req, res) => {
        const { userId } = req.body;
        const user = req.user;
        if (userId === user._id.toString()) {
            throw new utilities.BadRequestException("You cannot send a friend request to yourself");
        }
        const targetUser = await this.userRepository.exists({ _id: userId });
        if (!targetUser) {
            throw new utilities.NotFoundException("User not found");
        }
        const friends = user.friends || [];
        const isFriend = friends.some((friendId) => friendId.toString() === userId);
        if (isFriend) {
            throw new utilities.BadRequestException("You are already friends with this user");
        }
        const friendRequestsSent = user.friendRequestsSent || [];
        const requestAlreadySent = friendRequestsSent.some((requestId) => requestId.toString() === userId);
        if (requestAlreadySent) {
            throw new utilities.BadRequestException("Friend request already sent to this user");
        }
        const friendRequestsReceived = user.friendRequestsReceived || [];
        const requestAlreadyReceived = friendRequestsReceived.some((requestId) => requestId.toString() === userId);
        if (requestAlreadyReceived) {
            throw new utilities.BadRequestException("This user has already sent you a friend request. Please accept or reject it.");
        }
        await this.userRepository.update({ _id: user._id }, { $addToSet: { friendRequestsSent: userId } });
        await this.userRepository.update({ _id: userId }, { $addToSet: { friendRequestsReceived: user._id } });
        return res.status(200).json({
            message: "Friend request sent successfully",
            success: true,
        });
    };
    acceptFriendRequest = async (req, res) => {
        const { userId } = req.body;
        const user = req.user;
        const friendRequestsReceived = user.friendRequestsReceived || [];
        const hasRequest = friendRequestsReceived.some((requestId) => requestId.toString() == userId);
        if (!hasRequest) {
            throw new utilities.BadRequestException("No friend request from this user");
        }
        await this.userRepository.update({ _id: user._id }, {
            $pull: { friendRequestsReceived: userId },
            $addToSet: { friends: userId },
        });
        await this.userRepository.update({ _id: userId }, {
            $pull: { friendRequestsSent: user._id },
            $addToSet: { friends: user._id },
        });
        return res.status(200).json({
            message: "Friend request accepted successfully",
            success: true,
        });
    };
    rejectFriendRequest = async (req, res) => {
        const { userId } = req.body;
        const user = req.user;
        const friendRequestsReceived = user.friendRequestsReceived || [];
        const hasRequest = friendRequestsReceived.some((requestId) => requestId.toString() == userId);
        if (!hasRequest) {
            throw new utilities.BadRequestException("No friend request from this user");
        }
        await this.userRepository.update({ _id: user._id }, { $pull: { friendRequestsReceived: userId } });
        await this.userRepository.update({ _id: userId }, { $pull: { friendRequestsSent: user._id } });
        return res.status(200).json({
            message: "Friend request rejected successfully",
            success: true,
        });
    };
    unfriend = async (req, res) => {
        const { userId } = req.body;
        const user = req.user;
        if (userId === user._id.toString()) {
            throw new utilities.BadRequestException("Invalid operation");
        }
        const friends = user.friends || [];
        const isFriend = friends.some((friendId) => friendId.toString() == userId);
        if (!isFriend) {
            throw new utilities.BadRequestException("You are not friends with this user");
        }
        await this.userRepository.update({ _id: user._id }, { $pull: { friends: userId } });
        await this.userRepository.update({ _id: userId }, { $pull: { friends: user._id } });
        return res.status(200).json({
            message: "Unfriended successfully",
            success: true,
        });
    };
    deleteFriendRequest = async (req, res) => {
        const { userId } = req.body;
        const user = req.user;
        const friendRequestsSent = user.friendRequestsSent || [];
        const hasRequest = friendRequestsSent.some((requestId) => requestId.toString() == userId);
        if (!hasRequest) {
            throw new utilities.BadRequestException("No friend request sent to this user");
        }
        await this.userRepository.update({ _id: user._id }, { $pull: { friendRequestsSent: userId } });
        await this.userRepository.update({ _id: userId }, { $pull: { friendRequestsReceived: user._id } });
        return res.status(200).json({
            message: "Friend request deleted successfully",
            success: true,
        });
    };
}
exports.default = new UserService();
