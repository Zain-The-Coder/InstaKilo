import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import storyRouter from "./routes/story.routes.js";

const app = express();

// --- Core Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Instakilo API is running" });
});

// --- API Routes ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/stories", storyRouter);

// --- Multer & Global Error Handler Middleware ---
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: `Unexpected file field upload. Please use 'image' as the field name.`,
    });
  }
  if (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "An unexpected error occurred.",
    });
  }
  next();
});

export default app;
