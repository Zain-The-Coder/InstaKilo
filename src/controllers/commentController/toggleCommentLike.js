import Comment from "../../models/comment.model.js";

/**
 * @desc    Like/Unlike a comment (Toggle feature)
 * @route   POST /api/v1/comments/:id/like
 * @access  Private
 */
export const toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    const hasLiked = comment.likes.includes(currentUserId);

    if (hasLiked) {
      // Unlike comment
      comment.likes = comment.likes.filter((uId) => uId.toString() !== currentUserId.toString());
      await comment.save();
      return res.status(200).json({
        success: true,
        message: "Comment unliked successfully.",
        liked: false,
      });
    } else {
      // Like comment
      comment.likes.push(currentUserId);
      await comment.save();
      return res.status(200).json({
        success: true,
        message: "Comment liked successfully.",
        liked: true,
      });
    }
  } catch (error) {
    console.error("Error in toggleCommentLike controller:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
