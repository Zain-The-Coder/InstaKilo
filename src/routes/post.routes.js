import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  getFeedPosts,
  getExplorePosts,
  getUserPosts,
} from "../controllers/postController/index.js";

const postRouter = Router();

// Apply auth protector to all post routes
postRouter.use(protect);

// GET /api/v1/posts -> Get all posts
// POST /api/v1/posts -> Create new post
postRouter.route("/")
  .get(getAllPosts)
  .post(upload.single("image"), createPost);

// GET /api/v1/posts/feed -> Get following home feed (paginated)
postRouter.get("/feed", getFeedPosts);

// GET /api/v1/posts/explore -> Explore popular posts
postRouter.get("/explore", getExplorePosts);

// GET /api/v1/posts/:id -> Get single post detail
// DELETE /api/v1/posts/:id -> Delete a post
// PATCH /api/v1/posts/:id -> Edit post caption
postRouter.route("/:id")
  .get(getPostById)
  .delete(deletePost)
  .patch(updatePost);

// GET /api/v1/posts/user/:usernameOrId -> Get specific user's posts
// Note: We mount it on a subpath to prevent path namespace clash with /:id
postRouter.get("/user/:usernameOrId", getUserPosts);

export default postRouter;
