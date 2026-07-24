import User from "../../models/user.model.js";

/**
 * @desc    Remove a post from user's savedPosts
 * @route   POST /api/v1/posts/:id/unsave
 * @access  Private
 */
export const unsavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const idx = user.savedPosts.indexOf(postId);
    if (idx === -1) {
      return res.status(400).json({ success: false, message: "Post not saved" });
    }

    user.savedPosts.splice(idx, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post unsaved successfully",
      data: user.savedPosts,
    });
  } catch (error) {
    console.error("Error in unsavePost controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
