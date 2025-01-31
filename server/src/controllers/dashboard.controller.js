import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { userId } = req.user;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  // Aggregation pipeline for video statistics
  const videoStats = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  // Count total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  // Aggregation pipeline for likes
  const totalLikes = await Like.aggregate([
    {
      $match: { video: { $exists: true } },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $match: { "videoDetails.owner": new mongoose.Types.ObjectId(userId) },
    },
    {
      $count: "totalLikes",
    },
  ]);

  const stats = {
    totalVideos: videoStats[0]?.totalVideos || 0,
    totalViews: videoStats[0]?.totalViews || 0,
    totalSubscribers,
    totalLikes: totalLikes[0]?.totalLikes || 0,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Channel statistics retrieved successfully."),
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  // Aggregate videos uploaded by the user (channel owner)
  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        views: 1,
        likes: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!videos.length) {
    throw new ApiError(404, "No videos found for this channel!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "Channel videos retrieved successfully."),
    );
});

export { getChannelStats, getChannelVideos };
