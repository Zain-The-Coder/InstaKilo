import User from "../../models/user.model.js";

/**
 * @desc    Get user's saved posts
 * @route   GET /api/v1/posts/saved
 * @access  Private
 */
export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: 'savedPosts',
        populate: [
          { path: 'author', select: '_id username fullName profilePicture isVerified' },
          { path: 'comments', populate: { path: 'author', select: '_id username profilePicture' } }
        ]
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      count: user.savedPosts.length,
      data: user.savedPosts,
    });
  } catch (error) {
    console.error("Error in getSavedPosts controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
