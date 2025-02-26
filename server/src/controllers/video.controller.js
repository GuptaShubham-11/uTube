import { ApiError } from "../utils/ApiError.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;
  const userId = req.user?._id;

  const videos = await Video.aggregate([
    {
      $match: {
        ...(query ? { title: { $regex: query, $options: "i" } } : {}),
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      // ✅ Check if the logged-in user has liked the video
      $lookup: {
        from: "likes",
        let: {
          videoId: "$_id",
          userId: userId ? new mongoose.Types.ObjectId(userId) : null,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$video", "$$videoId"] },
                  { $eq: ["$likedBy", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "userLike",
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        createdAt: 1,
        ownerDetails: 1,
        isLiked: { $gt: [{ $size: "$userLike" }, 0] }, // ✅ true if the user has liked the video
      },
    },
  ]);

  const totalVideos = await Video.countDocuments(
    query ? { title: { $regex: query, $options: "i" } } : {},
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, total: totalVideos },
        "Videos retrieved successfully.",
      ),
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title & description are required!");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Both video file and thumbnail are required!");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath, "video");
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");

  if (!videoFile) throw new ApiError(400, "Video file upload failed!");
  if (!thumbnail) throw new ApiError(400, "Thumbnail upload failed!");

  const video = await Video.create({
    title,
    description,
    duration: videoFile?.duration,
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrieved successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required!");
  }

  if (!title) {
    throw new ApiError(400, "Title is required for update!");
  }

  if (!description) {
    throw new ApiError(400, "Description is required for update!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found!");
  }

  const oldThumbnailPath = video.thumbnail;
  const newThumbnailPath = req.file?.path;

  if (!newThumbnailPath) {
    throw new ApiError(400, "Thumbnail is required for update!");
  }

  let thumbnail;

  if (newThumbnailPath) {
    thumbnail = await uploadOnCloudinary(newThumbnailPath, "image");
  }

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail?.url || video?.thumbnail,
      },
    },
    {
      new: true,
    },
  );

  await deleteOnCloudinary(oldThumbnailPath, "image");

  return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated successfully."));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  await deleteOnCloudinary(video.videoFile);
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate videoId
  if (!videoId) {
    throw new ApiError(400, "Video ID is required!");
  }

  // Fetch the video by ID
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // Toggle the `isPublished` field
  video.isPublished = !video.isPublished;

  // Save the updated video
  const updatedVideo = await video.save();

  // Return the updated video
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        "Video publish status toggled successfully.",
      ),
    );
});

const updateVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate videoId
  if (!videoId) {
    throw new ApiError(400, "Video ID is required!");
  }

  // Fetch the video by ID
  const video = await Video.findById(videoId).populate("owner");

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // Increment the `views` field
  video.views += 1;

  // Save the updated video
  const updatedVideo = await video.save();

  // Return the updated video
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video views updated successfully."),
    );
});

const getSuggestedVideos = asyncHandler(async (req, res) => {
  //TODO: get suggested videos
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "asc",
  } = req.query;

  const suggestedVideos = await Video.aggregate([
    {
      $match: {
        isPublished: true,
        ...(query ? { title: { $regex: query, $options: "i" } } : {}),
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: Number(limit),
    },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        suggestedVideos,
        "Suggested videos retrieved successfully.",
      ),
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getSuggestedVideos,
  updateVideoViews,
};
