import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addComment,
  getComments,
  deleteComment,
  toggleCommentLike,
} from "../controllers/commentController/index.js";

const commentRouter = Router();

// Apply auth protector to all comment routes
commentRouter.use(protect);

// POST /api/v1/posts/:id/comments -> Add comment to post
// GET /api/v1/posts/:id/comments -> Get all comments for a post
// Note: These routes are mapped in post.routes.js to keep path nesting clean,
// but we map individual comment management endpoints here.

// DELETE /api/v1/comments/:id -> Delete comment (Comment owner or Post owner)
commentRouter.delete("/:id", deleteComment);

// POST /api/v1/comments/:id/like -> Toggle like on a comment
commentRouter.post("/:id/like", toggleCommentLike);

export default commentRouter;
