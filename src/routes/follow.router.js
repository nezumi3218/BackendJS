import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  follow,
  followers,
  following,
  unfollow,
} from "../controllers/follow.controller.js";

const router = Router();

// Toggle like
router.route("/follow").post(verifyJWT, follow);
router.route("/unfollow").post(verifyJWT, unfollow);

router.route("/followers").get(followers);
router.route("/following").get(following);

export default router;
