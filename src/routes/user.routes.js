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
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../controllers/blockController/index.js";

const userRouter = Router();

// Apply authorization protection on all user routes
userRouter.use(protect);

// GET /api/v1/users/me -> Get own profile
// PATCH /api/v1/users/me -> Update own profile
userRouter.route("/me")
  .get(getMyProfile)
  .patch(updateProfile);

// GET /api/v1/users/me/blocked -> Get list of blocked users
userRouter.get("/me/blocked", getBlockedUsers);

// POST /api/v1/users/:username/follow
userRouter.post("/:username/follow", followUser);

// POST /api/v1/users/:username/unfollow
userRouter.post("/:username/unfollow", unfollowUser);

// POST /api/v1/users/:username/block
userRouter.post("/:username/block", blockUser);

// POST /api/v1/users/:username/unblock
userRouter.post("/:username/unblock", unblockUser);

// GET /api/v1/users/:username/followers
userRouter.get("/:username/followers", getFollowers);

// GET /api/v1/users/:username/following
userRouter.get("/:username/following", getFollowing);

// GET /api/v1/users/:username/suggestions
userRouter.get("/:username/suggestions", getSuggestions);

// GET /api/v1/users/:username -> Get public profile by username
userRouter.get("/:username", getUserProfile);

export default userRouter;
