import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    // Check if user with given email or username already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "Email" : "Username";
      return res.status(409).json({
        success: false,
        message: `${field} is already taken.`,
      });
    }

    // Create user (password will be hashed automatically by pre-save hook in user.model.js)
    const newUser = await User.create({
      username,
      fullName,
      email,
      password,
    });

    // Generate JWT auth token
    const token = generateToken(newUser._id);

    // Prepare clean response user object (without password)
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      bio: newUser.bio,
      isPrivate: newUser.isPrivate,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Error in registerUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
