import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/authController/index.js";
import {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
} from "../middlewares/authValidation.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const authRouter = Router();

// POST /api/v1/auth/register
authRouter.post("/register", registerValidationRules, validate, registerUser);

// POST /api/v1/auth/login
authRouter.post("/login", loginValidationRules, validate, loginUser);

// POST /api/v1/auth/refresh-token
authRouter.post("/refresh-token", refreshToken);

// POST /api/v1/auth/forgot-password
authRouter.post("/forgot-password", forgotPasswordValidationRules, validate, forgotPassword);

// POST /api/v1/auth/reset-password
authRouter.post("/reset-password", resetPasswordValidationRules, validate, resetPassword);

export default authRouter;
