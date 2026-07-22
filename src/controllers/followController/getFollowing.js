import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";

/**
 * @desc    Get user's following list
 * @route   GET /api/v1/users/:username/following
 * @access  Private
 */
export const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const followingRelation = await Follow.find({ follower: user._id })
      .populate("following", "_id username fullName profilePicture isVerified")
      .select("following createdAt");

    const following = followingRelation.map((rel) => rel.following);

    return res.status(200).json({
      success: true,
      data: following,
    });
  } catch (error) {
    console.error("Error in getFollowing controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
