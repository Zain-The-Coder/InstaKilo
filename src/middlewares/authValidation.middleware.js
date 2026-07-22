import { body } from "express-validator";

export const registerValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and periods"),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidationRules = [
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const forgotPasswordValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),
];

export const resetPasswordValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];
