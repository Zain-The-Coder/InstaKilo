import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true, // ImageKit URL for the story image/video
    },
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who have seen the story
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      index: { expires: 0 }, // MongoDB TTL Index: automatically deletes document at expiresAt
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
