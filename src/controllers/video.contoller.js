import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";

const uploadVideo = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const userId = req.user._id;

    if (!title || !description) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Title and Description required"));
    }

    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, "Video file required"));
    }
    //Make changes and make verify the video path properly then upload //Logic fix

    const videoLink = await uploadOnCloudinary(req.file.path);
    const video = await Video.create({
      title,
      description,
      duration: Math.round(duration),
      videoUrl: videoLink.secure_url,
      owner: userId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Video Uploaded Successfully"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong while uploading the video");
  }
};

export { uploadVideo };
