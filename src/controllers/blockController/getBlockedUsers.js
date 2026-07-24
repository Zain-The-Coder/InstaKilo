import User from "../../models/user.model.js";

/**
 * @desc    Get list of users blocked by logged-in user
 * @route   GET /api/v1/users/me/blocked
 * @access  Private
 */
export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "blockedUsers",
      "_id username fullName profilePicture isVerified"
    );

    return res.status(200).json({
      success: true,
      data: user.blockedUsers || [],
    });
  } catch (error) {
    console.error("Error in getBlockedUsers controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
