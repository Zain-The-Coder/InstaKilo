import Post from "../../models/post.model.js";
import Comment from "../../models/comment.model.js"; // registers Comment schema

/**
 * @desc    Get single post details
 * @route   GET /api/v1/posts/:id
 * @access  Private
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("author", "_id username fullName profilePicture isVerified")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "_id username profilePicture isVerified",
        },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
