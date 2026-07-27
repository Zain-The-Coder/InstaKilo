import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/messageController/index.js";

const messageRouter = Router();

// Protect all message routes
messageRouter.use(protect);

messageRouter.route("/:otherUserId")
  .get(getMessages)
  .post(sendMessage);

export default messageRouter;
