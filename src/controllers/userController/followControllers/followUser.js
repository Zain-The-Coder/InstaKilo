import User from "../../../models/user.model.js";
import Follow from "../../../models/follow.model.js";

/**
 * @desc    Follow a user
 * @route   POST /api/v1/users/:username/follow
 * @access  Private
 */
export const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    // Verify target user exists by username
    const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found.",
      });
    }

    // Cannot follow yourself
    if (targetUser._id.toString() === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    // Check if relationship already exists
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUser._id,
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user.",
      });
    }

    // Create follow relationship
    await Follow.create({
      follower: currentUserId,
      following: targetUser._id,
    });

    return res.status(200).json({
      success: true,
      message: `Successfully followed ${targetUser.username}.`,
    });
  } catch (error) {
    console.error("Error in followUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
