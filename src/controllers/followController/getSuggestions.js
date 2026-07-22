import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";

/**
 * @desc    Get suggested users to follow ("Suggested for you" section)
 * @route   GET /api/v1/users/:username/suggestions
 * @access  Private
 */
export const getSuggestions = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const followDocs = await Follow.find({ follower: user._id }).select("following");
    const alreadyFollowingIds = followDocs.map((doc) => doc.following);

    const ignoreUserIds = [...alreadyFollowingIds, user._id];

    const suggestions = await User.find({
      _id: { $nin: ignoreUserIds },
      isActive: true,
    })
      .select("_id username fullName profilePicture isVerified bio")
      .limit(10);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Error in getSuggestions controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
