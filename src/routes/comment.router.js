import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  getPostComments,
  deleteComment,
  getCommentCount,
} from "../controllers/comment.controller.js";

const router = Router();

// add comment
router.route("/posts/:postId/comments").post(verifyJWT, addComment);

router.route("/posts/:postId/comment-count").get(getCommentCount);

// get all comments of a post
(router.route("/posts/:postId/comments"), get(getPostComments));

// delete comment
router.delete("/comments/:commentId", verifyJWT, deleteComment);

export default router;
