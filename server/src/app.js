import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// Route setup
const routes = [
  { path: "/api/v1/users", router: userRouter },
  { path: "/api/v1/videos", router: videoRouter },
  { path: "/api/v1/healthcheck", router: healthcheckRouter },
  { path: "/api/v1/tweets", router: tweetRouter },
  { path: "/api/v1/subscriptions", router: subscriptionRouter },
  { path: "/api/v1/comments", router: commentRouter },
  { path: "/api/v1/likes", router: likeRouter },
  { path: "/api/v1/playlist", router: playlistRouter },
  { path: "/api/v1/dashboard", router: dashboardRouter },
];

routes.forEach(({ path, router }) => app.use(path, router));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    status: err.statusCode || 500,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export { app };
