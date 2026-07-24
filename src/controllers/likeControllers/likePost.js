import Post from "../../models/post.model.js";
import Notification from "../../models/notification.model.js";

/**
 * @desc    Like a post
 * @route   POST /api/v1/posts/:id/like
 * @access  Private
 */
export const likePost = async (req, res) => {
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

    // Check if user has already liked the post
    if (post.likes.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this post.",
      });
    }

    // Add user ID to likes array
    post.likes.push(currentUserId);
    await post.save();

    // Create like notification if not own post
    if (post.author.toString() !== currentUserId.toString()) {
      await Notification.create({
        sender: currentUserId,
        receiver: post.author,
        type: "like",
        post: post._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully.",
    });
  } catch (error) {
    console.error("Error in likePost controller:", error);
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
