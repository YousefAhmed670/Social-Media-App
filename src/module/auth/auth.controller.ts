import { Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import authService from "./auth.service";
import * as authValidation from "./auth.validation";
const router = Router();

router.post(
  "/register",
  isValid(authValidation.registerSchema),
  authService.register
);
router.post("/login", isValid(authValidation.loginSchema), authService.login);
router.post(
  "/verify-2Step-login",
  isValid(authValidation.verify2StepLoginSchema),
  authService.verify2StepLogin
);
router.post("/send-otp", authService.sendOTP);
router.post(
  "/verify-email",
  isValid(authValidation.verifyEmailSchema),
  authService.verifyEmail
);
router.put(
  "/reset-password",
  isValid(authValidation.resetPasswordSchema),
  authService.resetPassword
);
router.post("/refresh-token", authService.refreshToken);
router.put("/logout", isAuthenticated, authService.logout);
export default router;
