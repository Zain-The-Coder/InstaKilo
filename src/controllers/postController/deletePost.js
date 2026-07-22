import Post from "../../models/post.model.js";
import Comment from "../../models/comment.model.js";

/**
 * @desc    Delete a post (Only owner can delete)
 * @route   DELETE /api/v1/posts/:id
 * @access  Private
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Authorization check: Only post author can delete it
    if (post.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }

    // Delete post
    await Post.findByIdAndDelete(id);

    // Clean up associated comments
    await Comment.deleteMany({ post: id });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deletePost controller:", error);
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
