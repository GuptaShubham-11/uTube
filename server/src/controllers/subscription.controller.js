import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;
  const { _id } = req.user;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel Id!");
  }

  if (!isValidObjectId(_id)) {
    throw new ApiError(400, "Invalid user Id!");
  }

  const existingSubscriber = await Subscription.findOne({
    channel: channelId,
    subscriber: _id,
  });

  if (existingSubscriber) {
    await Subscription.deleteOne({ _id: existingSubscriber?._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User unsubscribed successfully."));
  }

  const newSubscription = await Subscription.create({
    channel: channelId,
    subscriber: _id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newSubscription, "User subscribed successfully.")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id!");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails", // Ensures the result is cleaner by removing nested arrays
    },
    {
      $project: {
        subscriber: 1,
        subscriberDetails: 1,
      },
    },
  ]);

  if (!subscribers.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No subscribers found!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers retrieved successfully.")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid subscriber Id!");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails", // Ensures the result is cleaner by removing nested arrays
    },
    {
      $project: {
        channel: "$channelDetails._id",
        fullname: "$channelDetails.fullname",
        username: "$channelDetails.username",
        avatar: "$channelDetails.avatar",
      },
    },
  ]);

  if (!channels.length) {
    throw new ApiError(404, "No channels found for this user!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channels retrieved successfully."));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
