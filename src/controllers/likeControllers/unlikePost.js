import Post from "../../models/post.model.js";

/**
 * @desc    Unlike a post
 * @route   POST /api/v1/posts/:id/unlike
 * @access  Private
 */
export const unlikePost = async (req, res) => {
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

    // Check if user has liked the post
    if (!post.likes.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this post yet.",
      });
    }

    // Remove user ID from likes array
    post.likes = post.likes.filter((userId) => userId.toString() !== currentUserId.toString());
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully.",
    });
  } catch (error) {
    console.error("Error in unlikePost controller:", error);
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
