import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// Secured routes
router.use(verifyJWT);

router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changeCurrentPassword);
router.route("/current-user").get(getCurrentUser);
router.route("/update-user-details").patch(updateAccountDetails);
router
  .route("/update-user-avatar")
  .patch(upload.single("avatar"), updateUserAvatar);
router
  .route("/update-user-cover")
  .patch(upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:id").get(getUserChannelProfile);
router.route("/history").get(getWatchHistory);
router.route("/update-history/:videoId").post(updateWatchHistory);

export default router;
