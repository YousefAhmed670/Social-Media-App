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
exports.isAuthenticatedGraphql = void 0;
const DB_1 = require("../DB");
const utilities = __importStar(require("../utilities"));
const isAuthenticatedGraphql = async (context) => {
    const token = context.token;
    if (!token) {
        throw new utilities.UnauthorizedException("Unauthorized");
    }
    const payload = utilities.verifyToken(token);
    if (!payload) {
        throw new utilities.UnauthorizedException("Unauthorized");
    }
    const userRepository = new DB_1.UserRepository();
    const user = await userRepository.getOne({ _id: payload._id }, {}, { populate: { path: "friends", select: "fullName firstName lastName" } });
    if (!user) {
        throw new utilities.NotFoundException("User not found");
    }
    const blackListTokenRepository = new DB_1.TokenRepository();
    const blackListToken = await blackListTokenRepository.exists({
        userId: user._id,
        token,
        type: utilities.TOKEN_TYPE.Access,
    });
    if (blackListToken) {
        throw new utilities.UnauthorizedException("user logged out before");
    }
    if (user.credentialUpdatedAt > new Date(payload.iat * 1000)) {
        throw new utilities.UnauthorizedException("token expired");
    }
    context.user = user;
};
exports.isAuthenticatedGraphql = isAuthenticatedGraphql;
