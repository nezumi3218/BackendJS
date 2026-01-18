import mongoose, { Schema } from "mongoose";

const postImageSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    postImage: {
      type: postImageSchema,
      required: true,
    },
    caption: {
      type: String,
    },
    likes: {
      type: Number,
    },
    comments: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
