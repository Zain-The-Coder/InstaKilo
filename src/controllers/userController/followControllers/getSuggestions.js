import User from "../../../models/user.model.js";
import Follow from "../../../models/follow.model.js";

/**
 * @desc    Get suggested users to follow ("Suggested for you" section)
 * @route   GET /api/v1/users/:username/suggestions
 * @access  Private
 */
export const getSuggestions = async (req, res) => {
  try {
    const { username } = req.params;

    // Check if user exists
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 1. Get IDs of users this user is already following
    const followDocs = await Follow.find({ follower: user._id }).select("following");
    const alreadyFollowingIds = followDocs.map((doc) => doc.following);

    // 2. Add current user ID to the ignore list (so they aren't suggested to themselves)
    const ignoreUserIds = [...alreadyFollowingIds, user._id];

    // 3. Find suggestions: Users who are active, not in the ignore list, and limit to 10 users.
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
