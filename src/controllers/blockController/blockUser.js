import User from "../../models/user.model.js";

/**
 * @desc    Block a user by username
 * @route   POST /api/v1/users/:username/block
 * @access  Private
 */
export const blockUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = req.user;

    const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to block not found.",
      });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself.",
      });
    }

    // Add targetUser ID to current user's blockedUsers if not already present
    if (!currentUser.blockedUsers) currentUser.blockedUsers = [];
    
    if (currentUser.blockedUsers.includes(targetUser._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already blocked.",
      });
    }

    currentUser.blockedUsers.push(targetUser._id);
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: `Successfully blocked ${targetUser.username}.`,
    });
  } catch (error) {
    console.error("Error in blockUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
