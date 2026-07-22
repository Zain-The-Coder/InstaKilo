import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";

/**
 * @desc    Unfollow a user
 * @route   POST /api/v1/users/:username/unfollow
 * @access  Private
 */
export const unfollowUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to unfollow not found.",
      });
    }

    const result = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: targetUser._id,
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully unfollowed ${targetUser.username}.`,
    });
  } catch (error) {
    console.error("Error in unfollowUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
