import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getNotifications, markAsRead } from "../controllers/notificationController/index.js";

const notificationRouter = Router();

// Protect all notification routes
notificationRouter.use(protect);

notificationRouter.get("/", getNotifications);
notificationRouter.patch("/read", markAsRead);

export default notificationRouter;
