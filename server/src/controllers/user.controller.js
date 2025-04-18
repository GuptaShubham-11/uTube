import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";

// Generate access and refresh tokens for the user
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Server error generating access and refresh tokens."
    );
  }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { email, fullname, password } = req.body;

  if ([email, fullname, password].some((field) => !field.trim())) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser)
    throw new ApiError(409, "User with this email already exists.");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required.");

  const avatar = await uploadOnCloudinary(avatarLocalPath, "image");
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath, "image")
    : null;

  const user = await User.create({
    fullname,
    avatar: avatar.secure_url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(500, "User registration failed.");

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});

// Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError(400, "Email is required.");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(409, "User does not exist.");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Incorrect password.");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = { httpOnly: true, secure: true };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully."
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.body.refreshToken || req.cookies.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request.");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);

    if (!user || incomingRefreshToken !== user.refreshToken)
      throw new ApiError(401, "Invalid or expired refresh token.");

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    const options = { httpOnly: true, secure: true };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token.");
  }
});

// Change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "Incorrect old password.");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully."));
});

// Update user account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname } = req.body;

  if (!fullname) throw new ApiError(400, "Full name is required.");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname } },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully."));
});

// Update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  const oldAvatarPath = req.user?.avatar;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required for update.");
  }

  // Upload new avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.secure_url) {
    throw new ApiError(400, "Avatar upload failed.");
  }

  // Update user avatar in DB
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.secure_url } },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(500, "User update failed.");
  }

  // Delete old avatar only if a previous one exists
  if (oldAvatarPath) {
    await deleteOnCloudinary(oldAvatarPath, "image");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully."));
});

// Update user cover image
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  const oldCoverImagePath = req.user?.coverImage;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required for update.");
  }

  // Upload new cover image
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage?.secure_url) {
    throw new ApiError(400, "Cover image upload failed.");
  }

  // Update user cover image in DB
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.secure_url } },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(500, "User update failed.");
  }

  // Delete old cover image only if a previous one exists
  if (oldCoverImagePath) {
    await deleteOnCloudinary(oldCoverImagePath, "image");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully."));
});

// Get user channel profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Invalid or missing ID.");

  const channel = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersToCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: { $in: [req.user?._id, "$subscribers.subscriber"] },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersToCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel.length) throw new ApiError(400, "Channel does not exist.");

  res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully.")
    );
});

// Get watch history
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }],
            },
          },
          { $addFields: { owner: { $first: "$owner" } } },
        ],
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully."
      )
    );
});

const updateWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.params;

    const HISTORY_LIMIT = 30;

    // Check if the video exists
    const videoExists = await Video.exists({ _id: videoId });
    if (!videoExists) {
      return res.status(404).json(new ApiError(404, "Video not found"));
    }

    // Find user and update watch history
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Remove video if it already exists in history
    user.watchHistory = user.watchHistory.filter(
      (id) => id.toString() !== videoId
    );

    // Add new video to the start (most recent)
    user.watchHistory.unshift(videoId);

    // Trim history to maintain limit
    if (user.watchHistory.length > HISTORY_LIMIT) {
      user.watchHistory = user.watchHistory.slice(0, HISTORY_LIMIT);
    }

    await user.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { watchHistory: user.watchHistory },
          "Watch history updated successfully."
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "Server error updating watch history."
        )
      );
  }
};


export {
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
};
