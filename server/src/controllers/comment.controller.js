import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  let { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }

  page = Number(page);
  limit = Number(limit);

  const commentsPipeline = [
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // ✅ Lookup likes for the comment by the current user
    {
      $lookup: {
        from: "likes",
        let: {
          commentId: "$_id",
          userId: userId ? new mongoose.Types.ObjectId(userId) : null,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$comment", "$$commentId"] }, // Match the comment
                  { $eq: ["$likedBy", "$$userId"] }, // Match the current user
                ],
              },
            },
          },
        ],
        as: "userLike",
      },
    },

    // ✅ Add isLiked field based on userLike array
    {
      $addFields: { isLiked: { $gt: [{ $size: "$userLike" }, 0] } },
    },

    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },

    {
      $project: {
        content: 1,
        createdAt: 1,
        owner: { _id: 1, fullname: 1, avatar: 1 },
        isLiked: 1, // ✅ Return whether the comment is liked
      },
    },
  ];

  const totalCommentsPipeline = [
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $count: "total",
    },
  ];

  const [comments, totalCountResult] = await Promise.all([
    Comment.aggregate(commentsPipeline),
    Comment.aggregate(totalCommentsPipeline),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        total: totalCountResult.length ? totalCountResult[0].total : 0,
        page,
        limit,
      },
      "Comments retrieved successfully."
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId, userId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required!");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is invalid!");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "userId is invalid!");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment is created successfully."));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required!");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment Id is invalid!");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment updated successfully.")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment Id is invalid!");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
