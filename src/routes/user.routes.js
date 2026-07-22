import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
} from "../controllers/userController/index.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getSuggestions,
} from "../controllers/followController/index.js";

const userRouter = Router();

// Apply authorization protection on all user routes
userRouter.use(protect);

// GET /api/v1/users/me -> Get own profile
// PATCH /api/v1/users/me -> Update own profile
userRouter.route("/me")
  .get(getMyProfile)
  .patch(updateProfile);

// POST /api/v1/users/:username/follow
userRouter.post("/:username/follow", followUser);

// POST /api/v1/users/:username/unfollow
userRouter.post("/:username/unfollow", unfollowUser);

// GET /api/v1/users/:username/followers
userRouter.get("/:username/followers", getFollowers);

// GET /api/v1/users/:username/following
userRouter.get("/:username/following", getFollowing);

// GET /api/v1/users/:username/suggestions
userRouter.get("/:username/suggestions", getSuggestions);

// GET /api/v1/users/:username -> Get public profile by username
userRouter.get("/:username", getUserProfile);

export default userRouter;
