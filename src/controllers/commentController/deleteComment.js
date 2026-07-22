import Comment from "../../models/comment.model.js";
import Post from "../../models/post.model.js";

/**
 * @desc    Delete a comment (Comment author or Post owner can delete)
 * @route   DELETE /api/v1/comments/:id
 * @access  Private
 */
export const deleteComment = async (req, res) => {
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

    const post = await Post.findById(comment.post);

    // Authorization: Comment author OR Post owner can delete
    const isCommentAuthor = comment.author.toString() === currentUserId.toString();
    const isPostOwner = post && post.author.toString() === currentUserId.toString();

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    // Delete comment
    await Comment.findByIdAndDelete(id);

    // Remove reference from Post comments array
    if (post) {
      post.comments = post.comments.filter((cId) => cId.toString() !== id);
      await post.save();
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteComment controller:", error);
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
