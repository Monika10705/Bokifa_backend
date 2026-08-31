const express = require("express");
const { registerUser, loginUser, getProfile, updateProfile, testEmail, forgotPassword, resetPassword, sendEmailChangeOtp,
  verifyEmailChangeOtp, } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/test-email", testEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post(
  "/profile/email/send-otp",
  authMiddleware,
  sendEmailChangeOtp
);

router.post(
  "/profile/email/verify-otp",
  authMiddleware,
  verifyEmailChangeOtp
);

module.exports = router;
