import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createStory,
  getStoriesFeed,
  viewStory,
  deleteStory,
} from "../controllers/storyController/index.js";

const storyRouter = Router();

// Apply auth protector to all story routes
storyRouter.use(protect);

// GET /api/v1/stories/feed -> Get following list active stories
storyRouter.get("/feed", getStoriesFeed);

// POST /api/v1/stories -> Upload a new story (Image single upload field named "image")
storyRouter.post("/", upload.single("image"), createStory);

// POST /api/v1/stories/:id/view -> Track view seen status
storyRouter.post("/:id/view", viewStory);

// DELETE /api/v1/stories/:id -> Manual delete story before active time expiration
storyRouter.delete("/:id", deleteStory);

export default storyRouter;
