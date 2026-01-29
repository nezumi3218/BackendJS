import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Follow } from "../models/follow.model.js";

const follow = asyncHandler(async (req, res) => {
  const { followed } = req.body;

  const follower = req.user?._id;

  if (!follower || !followed) {
    throw new ApiError(400, "Follower and followed both required");
  }

  const alreadyFollowed = await Follow.findOne({ followed, follower });
  if (alreadyFollowed) {
    throw new ApiError(400, "Already following");
  }

  const follow = await Follow.create({
    followed: followed,
    follower: follower,
  });

  if (!follow) {
    throw new ApiError(400, "Couldn't follow");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, follow, "Successfully followed"));
});

const unfollow = asyncHandler(async (req, res) => {
  const { unfollowed } = req.body;
  const unfollower = req.user?.id;

  if (!unfollowed || !unfollower) {
    throw new ApiError(400, "All fields required");
  }

  const result = await Follow.deleteOne({ unfollowed, unfollower });

  if (result.deletedCount > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unfollowed the user successfully"));
  } else {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "User already unfollowed or was never followed"
        )
      );
  }
});

const followers = asyncHandler(async (req, res) => {
  const followed = req.user?._id;

  const followers = await Follow.find({ followed });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        followers.length,
        "Fetched the followers successfully"
      )
    );
});

const following = asyncHandler(async (req, res) => {
  const follower = req.user?._id;

  const following = await Follow.find({ follower });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        following.length,
        "Fetched the following successfully"
      )
    );
});

export { follow, unfollow, followers, following };
