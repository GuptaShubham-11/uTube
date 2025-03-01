import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  const { videoId } = req.params;
  const { _id } = req.user;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Inavlid video Id");
  }

  if (!isValidObjectId(_id)) {
    throw new ApiError(400, "Inavlid user Id");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: _id,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike?._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like reomoved successfully."));
  }

  const newLike = await Like.create({ video: videoId, likedBy: _id });
  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Like added successfully."));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Inavlid comment Id");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Inavlid user Id");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike?._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like reomoved successfully."));
  }

  const newLike = await Like.create({ comment: commentId, likedBy: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Like added successfully."));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet
  const { tweetId } = req.params;
  const { userId } = req.user;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Inavlid tweet Id");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Inavlid user Id");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike?._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like reomoved successfully."));
  }

  const newLike = await Like.create({ tweet: tweetId, likedBy: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Like added successfully."));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
        video: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $unwind: "$videoDetails", // Flatten the joined data for easy access
    },
    {
      $project: {
        _id: 0, // Exclude `_id` from Like document
        likedAt: "$createdAt", // Include the timestamp of the like
        videoDetails: 1, // Include full video details
      },
    },
  ]);

  if (likedVideos.length === 0) {
    throw new ApiError(400, "No liked videos found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos retrieved successfully.")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
