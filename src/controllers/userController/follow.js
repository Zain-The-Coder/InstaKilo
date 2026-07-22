import User from "../../models/user.model.js";
import Follow from "../../models/follow.model.js";

/**
 * @desc    Follow a user
 * @route   POST /api/v1/users/:id/follow
 * @access  Private
 */
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Cannot follow yourself
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found.",
      });
    }

    // Check if relationship already exists
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUserId,
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
      following: targetUserId,
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

/**
 * @desc    Unfollow a user
 * @route   POST /api/v1/users/:id/unfollow
 * @access  Private
 */
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to unfollow not found.",
      });
    }

    // Find and delete the follow relationship
    const result = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: targetUserId,
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully unfollowed ${targetUser.username}.`,
    });
  } catch (error) {
    console.error("Error in unfollowUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @desc    Get user's followers list
 * @route   GET /api/v1/users/:id/followers
 * @access  Private
 */
export const getFollowers = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find all followers and populate user details
    const followersRelation = await Follow.find({ following: targetUserId })
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
