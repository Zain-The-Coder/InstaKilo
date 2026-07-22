import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
} from "../controllers/userController/index.js";

const userRouter = Router();

// Apply authorization protection on all user routes
userRouter.use(protect);

// GET /api/v1/users/me -> Get own profile
// PATCH /api/v1/users/me -> Update own profile
userRouter.route("/me")
  .get(getMyProfile)
  .patch(updateProfile);

// POST /api/v1/users/:id/follow
userRouter.post("/:id/follow", followUser);

// POST /api/v1/users/:id/unfollow
userRouter.post("/:id/unfollow", unfollowUser);

// GET /api/v1/users/:id/followers
userRouter.get("/:id/followers", getFollowers);

// GET /api/v1/users/:username -> Get public profile by username
userRouter.get("/:username", getUserProfile);

export default userRouter;
