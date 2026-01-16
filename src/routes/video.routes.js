import { Router } from "express";
import uploadVideo from "../controllers/video.contoller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(upload.single("uploadVideo"), uploadVideo);

export default router;
