import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";
import { sendWhatsAppOTP } from "../../services/whatsapp.service.js";

/**
 * @desc    Forgot Password - Validate username & phone, generate OTP & send via WhatsApp
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { username, phoneNumber } = req.body;

    // Find user by username (case-insensitive)
    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });

    // Check if user exists and phone number matches
    if (!user || user.phoneNumber.trim() !== phoneNumber.trim()) {
      return res.status(404).json({
        success: false,
        message: "Username and phone number do not match our records.",
      });
    }

    // Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing in DB for security
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Set OTP expiry time (10 minutes from now)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOTP = hashedOTP;
    user.resetOTPExpires = otpExpires;
    await user.save();

    // Send OTP via WhatsApp service
    await sendWhatsAppOTP(user.phoneNumber, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your WhatsApp successfully.",
      data: {
        username: user.username,
        phoneNumber: user.phoneNumber,
        // In dev mode, we return navigateNext hint for frontend
        navigateTo: "/reset-password",
      },
    });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * @desc    Reset Password - Verify OTP & update user password
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;

    // Find user by username and select resetOTP
    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    }).select("+resetOTP +resetOTPExpires");

    if (!user || !user.resetOTP || !user.resetOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid request or OTP expired. Please request a new OTP.",
      });
    }

    // Check if OTP is expired
    if (Date.now() > new Date(user.resetOTPExpires).getTime()) {
      user.resetOTP = undefined;
      user.resetOTPExpires = undefined;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Hash incoming OTP and compare with stored hash
    const incomingHashedOTP = crypto.createHash("sha256").update(otp.trim()).digest("hex");
    if (incomingHashedOTP !== user.resetOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check the code sent to your WhatsApp.",
      });
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    user.refreshToken = ""; // Invalidate active refresh tokens on password change
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful! Please log in with your new password.",
      data: {
        navigateTo: "/login",
      },
    });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
