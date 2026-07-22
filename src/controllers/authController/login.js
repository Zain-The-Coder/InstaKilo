import User from "../../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

/**
 * @desc    Login user (supports login via username OR email)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const loginIdentifier = username || email;

    if (!loginIdentifier) {
      return res.status(400).json({
        success: false,
        message: "Please provide your username or email.",
      });
    }

    const user = await User.findOne({
      $or: [
        { username: loginIdentifier.toLowerCase().trim() },
        { email: loginIdentifier.toLowerCase().trim() },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user document in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set options for secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
    };

    // Store tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      website: user.website,
      isPrivate: user.isPrivate,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error in loginUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
