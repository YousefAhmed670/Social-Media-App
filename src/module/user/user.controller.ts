import { Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import userService from "./user.service";
import * as userValidation from "./user.validation";

const router = Router();

router.get("/:id", userService.getProfile);
router.patch(
  "/password",
  isAuthenticated,
  isValid(userValidation.updatePasswordSchema),
  userService.updatePassword
);
router.patch(
  "/basic-info",
  isAuthenticated,
  isValid(userValidation.updateBasicInfoSchema),
  userService.updateBasicInfo
);
router.post("/email-request", isAuthenticated, userService.requestEmailUpdate);
router.patch(
  "/email",
  isAuthenticated,
  isValid(userValidation.updateEmailSchema),
  userService.updateEmail
);
router.post(
  "/2StepVerify",
  isAuthenticated,
  isValid(userValidation.request2StepSchema),
  userService.request2StepVerification
);
router.post(
  "/2StepVerify/enable",
  isAuthenticated,
  isValid(userValidation.verify2StepSchema),
  userService.enable2StepVerification
);
router.post(
  "/2StepVerify/disable-request",
  isAuthenticated,
  isValid(userValidation.disable2StepRequestSchema),
  userService.disable2StepVerificationRequest
);
router.post(
  "/2StepVerify/disable",
  isAuthenticated,
  isValid(userValidation.disable2StepSchema),
  userService.disable2StepVerification
);

export default router;
