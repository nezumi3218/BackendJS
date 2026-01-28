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
  console.log(req.user._id);

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
    comments: 0,
    owner: req.user,
  });

  if (!post) {
    throw new ApiError(400, "Failed to upload post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Successfully Posted!"));
});

const getFeedPosts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate({
        path: "owner",
        select: "username fullname avatar",
      })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          success: true,
          page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          posts,
        },
        "All posts fetched"
      )
    );
  } catch (error) {
    console.error("Get Feed Error:", error);
    throw new ApiError(410, "Failed to load all posts");
  }
});

const getUserPost = asyncHandler(async (req, res) => {
  const posts = await Post.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate("owner", "username fullname avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User posts successfully fetched"));
});

const getSinglePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId).populate(
    "owner",
    "username fullname avatar"
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // only owner can delete
  if (post.owner?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { uploadPost, getFeedPosts, getUserPost, getSinglePost, deletePost };
