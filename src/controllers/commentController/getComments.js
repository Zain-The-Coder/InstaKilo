import Comment from "../../models/comment.model.js";

/**
 * @desc    Get all comments for a post
 * @route   GET /api/v1/posts/:id/comments
 * @access  Private
 */
export const getComments = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "_id username profilePicture isVerified");

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Error in getComments controller:", error);
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
