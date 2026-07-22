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
    // req.user is populated by protect middleware
    // Fetch user details including private settings, email, phone etc.
    const user = await User.findById(req.user._id);

    // Get followers and following counts
    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    // Get user's post count
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

    // Get followers and following counts
    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    // Get user's post count
    const postCount = await Post.countDocuments({ author: user._id });

    // Check if the requesting user (req.user) is following this user
    const isFollowing = await Follow.exists({
      follower: req.user._id,
      following: user._id,
    });

    // Clean profile data (do not expose private details like email/phone unless it's their own profile)
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

    // If it's private profile, the frontend might hide posts unless isFollowing is true or it's own profile
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

/**
 * @desc    Update current user profile (Bio, profile pic, name, website, gender, isPrivate)
 * @route   PATCH /api/v1/users/me
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, website, gender, profilePicture, isPrivate } = req.body;

    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (bio !== undefined) updates.bio = bio;
    if (website !== undefined) updates.website = website;
    if (gender !== undefined) updates.gender = gender;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        website: updatedUser.website,
        gender: updatedUser.gender,
        isPrivate: updatedUser.isPrivate,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
