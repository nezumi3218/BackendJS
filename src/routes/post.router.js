import {
  getFeedPosts,
  getUserPost,
  uploadPost,
} from "../controllers/post.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { likePost } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/post").post(
  verifyJWT,
  upload.fields([
    {
      name: "postImage",
      maxCount: 1,
    },
  ]),

  uploadPost
);
// router.route("/like").post(likePost);

router.route("/user-posts").get(verifyJWT, getUserPost);
router.route("/feed-posts").get(verifyJWT, getFeedPosts);

export default router;
