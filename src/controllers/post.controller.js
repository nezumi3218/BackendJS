import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { response } from "express";

const uploadPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;

  // let postLocalPath;
  // if(
  //     req.files &&
  //     Array.isArray(req.files.postImage) &&
  //     req.files.postImage.length > 0
  // ) {
  //     postLocalPath = req.files.postImage[0].path;
  // }

  const postImageLocalPath = req.files.postImage[0].path;

  if (!postImageLocalPath) {
    throw new ApiError(400, "Post image required");
  }

  const uploadResponse = await uploadOnCloudinary(postImageLocalPath);

  if (!uploadResponse) {
    throw new ApiError(400, "Failed to upload post on cloudinary");
  }

  // console.log("Upload responsee =>", uploadResponse);

  const postImage = {
    id: uploadResponse.public_id,
    url: uploadResponse.secure_url,
  };

  if (!postImage) {
    throw new ApiError(400, "Failed to upload post");
  }

  const post = await Post.create({
    postImage: postImage,
    caption,
    likes: 0,
    comment: 0,
  });

  if (!post) {
    throw new ApiError(400, "Failed to upload post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Successfully Posted!"));
});

export { uploadPost };
