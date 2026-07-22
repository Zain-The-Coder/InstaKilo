import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";
import Post from "../../models/post.model.js";

/**
 * @desc    Get current user profile (with private information)
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    const postCount = await Post.countDocuments({ author: user._id });

    const userProfile = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      bio: user.bio,
      website: user.website,
      gender: user.gender,
      isPrivate: user.isPrivate,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      followersCount,
      followingCount,
      postCount,
    };

    return res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Error in getMyProfile controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
