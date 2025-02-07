const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/authSchema");
const OtpVerification = require("../models/otpVerificationSchema");
const Helper = require("../helper/otpGenerator");
const niv = require("node-input-validator");

const RegisterUser = async (req, res) => {
  const { name, mobileNo, password } = req.body;

  try {
    const userExist = await Auth.findOne({ mobileNo });
    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new Auth({
      name,
      mobileNo,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const LoginUser = async (req, res) => {
  const { mobileNo, password } = req.body;

  try {
    const user = await Auth.findOne({ mobileNo });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "User logged in successfully",
      token,
      user: { id: user._id, name: user.name, mobileNo: user.mobileNo },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const ForgotPassword = async (req, res) => {
  const { mobileNo } = req.body;
  try {
    const user_data = await Auth.findOne({ mobileNo });

    if (!user_data) {
      return res.status(404).json({
        message: "User not found with this Mobile No.",
      });
    }

    const otp = Helper.generateRandomString(6, true);

    const data = {
      name: user_data.name,
      otp,
    };
    console.log(data);

    await new OtpVerification({
      mobileNo: req.body.mobileNo,
      otp,
    }).save();

    return res.status(200).json({
      message: "OTP has been sent to your mobile No",
      result: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

const VerifyOtp = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    const objValidation = new niv.Validator(req.body, {
      mobileNo: "required",
      otp: "required",
    });
    const matched = await objValidation.check();

    if (!matched) {
      return res.status(422).send({
        message: "Validation error",
        errors: objValidation.errors,
      });
    }

    const checkOTP = await OtpVerification.findOne({
      mobileNo: mobileNo,
      otp: req.body.otp,
    });

    if (!checkOTP || checkOTP.otp !== req.body.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    return res.status(200).json({
      message: "OTP Verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message || err,
    });
  }
};

const DeleteOTP = async (mobileNo, otp) => {
  let deleteOTP = await OtpVerification.findOneAndDelete({ mobileNo, otp });
  if (!deleteOTP) {
    console.log("Unable to delete OTP");
  }
  console.log("OTP deleted");
};

const ResetPassword = async (req, res) => {
  try {
    const { mobileNo } = req.body;
    const objValidation = new niv.Validator(req.body, {
      token: "required",
      mobileNo: "required",
      newPassword: "required|minLength:6",
    });
    const matched = await objValidation.check();

    if (!matched) {
      return res.status(422).send({
        message: "Validation error",
        errors: objValidation.errors,
      });
    }

    const checkOTP = await OtpVerification.findOne({ mobileNo }).sort({
      createdAt: -1,
    });

    if (!checkOTP || checkOTP.otp !== req.body.token) {
      return res.status(400).json({
        message: "Invalid Token",
      });
    }

    const user_data = await Auth.findOne({ mobileNo });

    if (!user_data) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    await Auth.findByIdAndUpdate(
      user_data._id,
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    );

    await DeleteOTP(mobileNo, req.body.token);

    return res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message || err,
    });
  }
};

const LogoutUser = (req, res) => {
  try {
    res.json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  VerifyOtp,
  DeleteOTP,
  ResetPassword,
  LogoutUser,
};