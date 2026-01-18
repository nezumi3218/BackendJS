import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/likes.model.js";
import { Post } from "../models/post.model.js";

const likePost = asyncHandler(async (req, res) => {
  const { currentPost } = req.body;
  const currentUser = req.user;

  if (!(currentPost == Like.post || currentUser == Like.user)) {
    await Post.post({
      currentPost,
      $inc: {
        likes: 1,
      },
      new: true,
    });
  }

  const like = await Like.create({
    post: currentPost,
    user: currentUser,
  });
});

export { likePost };
