import jwt from "jsonwebtoken";
import config from "../config/config.js";

/**
 * Generate Access Token (Short-lived)
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.accessTokenExpiry,
  });
};

/**
 * Generate Refresh Token (Long-lived)
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiry,
  });
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret);
};
