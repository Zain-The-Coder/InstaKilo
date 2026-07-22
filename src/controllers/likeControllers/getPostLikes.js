import Post from "../../models/post.model.js";

/**
 * @desc    Get users who liked the post (Only post owner can view)
 * @route   GET /api/v1/posts/:id/likes
 * @access  Private
 */
export const getPostLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const post = await Post.findById(id).populate("likes", "_id username fullName profilePicture isVerified");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Authorization check: Only the owner of the post can view the likes list
    if (post.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the post owner can view the likes list.",
      });
    }

    return res.status(200).json({
      success: true,
      data: post.likes,
    });
  } catch (error) {
    console.error("Error in getPostLikes controller:", error);
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
