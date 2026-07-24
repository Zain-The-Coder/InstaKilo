import User from "../../models/user.model.js";

/**
 * @desc    Save a post to user's savedPosts
 * @route   POST /api/v1/posts/:id/save
 * @access  Private
 */
export const savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ success: false, message: "Post already saved" });
    }

    user.savedPosts.push(postId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post saved successfully",
      data: user.savedPosts,
    });
  } catch (error) {
    console.error("Error in savePost controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
