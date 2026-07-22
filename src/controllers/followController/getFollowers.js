import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";

/**
 * @desc    Get user's followers list
 * @route   GET /api/v1/users/:username/followers
 * @access  Private
 */
export const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const followersRelation = await Follow.find({ following: user._id })
      .populate("follower", "_id username fullName profilePicture isVerified")
      .select("follower createdAt");

    const followers = followersRelation.map((rel) => rel.follower);

    return res.status(200).json({
      success: true,
      data: followers,
    });
  } catch (error) {
    console.error("Error in getFollowers controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
