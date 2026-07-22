import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

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

export default app;
