import Post from "../../models/post.model.js";
import Comment from "../../models/comment.model.js";

/**
 * @desc    Get all posts (Timeline Feed)
 * @route   GET /api/v1/posts
 * @access  Private
 */
export const getAllPosts = async (req, res) => {
  try {
    // Pagination parameters (default to page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts sorted by newest first
    // Populate author details (username, profile pic, isVerified)
    // Populate comment authors if comments exist
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "_id username fullName profilePicture isVerified")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "_id username profilePicture isVerified",
        },
      });

    // Get total posts count for pagination metadata
    const totalPosts = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      count: posts.length,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      data: posts,
    });
  } catch (error) {
    console.error("Error in getAllPosts controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve posts.",
    });
  }
};
