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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const user_service_1 = __importDefault(require("./user.service"));
const userValidation = __importStar(require("./user.validation"));
const router = (0, express_1.Router)();
router.get("/:id", user_service_1.default.getProfile);
router.patch("/password", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.updatePasswordSchema), user_service_1.default.updatePassword);
router.patch("/basic-info", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.updateBasicInfoSchema), user_service_1.default.updateBasicInfo);
router.post("/email-request", middleware_1.isAuthenticated, user_service_1.default.requestEmailUpdate);
router.patch("/email", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.updateEmailSchema), user_service_1.default.updateEmail);
router.post("/2StepVerify", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.request2StepSchema), user_service_1.default.request2StepVerification);
router.post("/2StepVerify/enable", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.verify2StepSchema), user_service_1.default.enable2StepVerification);
router.post("/2StepVerify/disable-request", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.disable2StepRequestSchema), user_service_1.default.disable2StepVerificationRequest);
router.post("/2StepVerify/disable", middleware_1.isAuthenticated, (0, middleware_1.isValid)(userValidation.disable2StepSchema), user_service_1.default.disable2StepVerification);
exports.default = router;
