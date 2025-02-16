import { ApiError } from "../utils/ApiError.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const videos = await Video.aggregate([
    {
      // Filter videos
      $match: {
        ...(query ? { title: { $regex: query, $options: "i" } } : {}),
        ...(userId ? { user: userId } : {}),
      },
    },
    {
      // Sort videos
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    {
      // Pagination
      $skip: (page - 1) * limit,
    },
    {
      // Limit results
      $limit: Number(limit),
    },
    {
      // Project specific fields
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
      },
    },
  ]);

  const totalVideos = await Video.aggregate([
    {
      $match: {
        ...(query ? { title: { $regex: query, $options: "i" } } : {}),
        ...(userId ? { user: userId } : {}),
      },
    },
    {
      $count: "total",
    },
  ]);

  const total = totalVideos.length ? totalVideos[0].total : 0;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { videos, total }, "Videos retrieved successfully."),
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
  });

  return res.status(200).json(new ApiResponse(200, video, "Video published successfully."));
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

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: newThumbnailPath?.url,
      },
    },
    {
      new: true,
    },
  );

  await deleteOnCloudinary(oldThumbnailPath);

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

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
