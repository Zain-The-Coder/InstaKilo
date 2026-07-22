import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.model.js";

/**
 * Protect routes - verifies access token and attaches user to request
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from DB and attach to req
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with this id.",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "User account is deactivated.",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. Invalid or expired token.",
      });
    }
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
