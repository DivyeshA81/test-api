const express = require("express");
const {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  VerifyOtp,
  ResetPassword,
  LogoutUser,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-otp", VerifyOtp);
router.post("/reset-password", ResetPassword);
router.post("/logout", LogoutUser);

module.exports = router;