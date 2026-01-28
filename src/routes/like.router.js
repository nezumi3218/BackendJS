import { Router } from "express";
import { toggleLikePost } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Toggle like
router.post("/posts/:postId/like", verifyJWT, toggleLikePost);

export default router;
