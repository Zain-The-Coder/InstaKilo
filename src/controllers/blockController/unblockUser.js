import User from "../../models/user.model.js";

/**
 * @desc    Unblock a user by username
 * @route   POST /api/v1/users/:username/unblock
 * @access  Private
 */
export const unblockUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = req.user;

    const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!currentUser.blockedUsers || !currentUser.blockedUsers.includes(targetUser._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not blocked.",
      });
    }

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: `Successfully unblocked ${targetUser.username}.`,
    });
  } catch (error) {
    console.error("Error in unblockUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
