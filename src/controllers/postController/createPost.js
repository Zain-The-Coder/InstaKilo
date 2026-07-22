import Post from "../../models/post.model.js";
import { uploadImage } from "../../services/imagekit.service.js";

/**
 * @desc    Create a new post with image upload via ImageKit
 * @route   POST /api/v1/posts
 * @access  Private
 */
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const authorId = req.user._id;

    // Check if image file was sent in multi-part body
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image for the post.",
      });
    }

    // Prepare filename
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `post_${authorId}_${Date.now()}.${fileExtension}`;

    // Upload to ImageKit using our service
    const imageUrl = await uploadImage(req.file.buffer, fileName, "/posts");

    // Create post in DB
    const newPost = await Post.create({
      caption: caption || "",
      image: imageUrl,
      author: authorId,
    });

    // Populate author details for the response
    const populatedPost = await newPost.populate(
      "author",
      "_id username fullName profilePicture isVerified"
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: populatedPost,
    });
  } catch (error) {
    console.error("Error in createPost controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to create post.",
    });
  }
};
