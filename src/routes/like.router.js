import { Router } from "express";
import {
  getLikesCount,
  toggleLikePost,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Toggle like
router.route("/posts/:postId/like-count").get(getLikesCount);
router.route("/posts/:postId/like").post(verifyJWT, toggleLikePost);

export default router;
