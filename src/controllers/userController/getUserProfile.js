import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";
import Post from "../../models/post.model.js";

/**
 * @desc    Get any user profile by username
 * @route   GET /api/v1/users/:username
 * @access  Private/Public (Authenticated)
 */
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    const postCount = await Post.countDocuments({ author: user._id });

    const isFollowing = await Follow.exists({
      follower: req.user._id,
      following: user._id,
    });

    const isOwnProfile = req.user._id.toString() === user._id.toString();

    const publicProfile = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      website: user.website,
      isPrivate: user.isPrivate,
      isVerified: user.isVerified,
      followersCount,
      followingCount,
      postCount,
      isFollowing: !!isFollowing,
      isOwnProfile,
    };

    return res.status(200).json({
      success: true,
      data: publicProfile,
    });
  } catch (error) {
    console.error("Error in getUserProfile controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
