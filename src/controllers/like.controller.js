import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/likes.model.js";
import { Post } from "../models/post.model.js";

const toggleLikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const existingLike = await Like.findOne({ post: postId, user: userId });

  if (existingLike) {
    // User already liked → unlike
    await Like.deleteOne({ _id: existingLike._id });
    post.likes = Math.max(0, post.likes - 1); // never go below 0
    await post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post unliked successfully"));
  } else {
    // Like the post
    await Like.create({ post: postId, user: userId });
    post.likes = (post.likes || 0) + 1;
    await post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post liked successfully"));
  }
});

const getLikesCount = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  return res.status(200).json(new ApiResponse(200, post.likes, "Likes count"));
});

export { toggleLikePost, getLikesCount };
