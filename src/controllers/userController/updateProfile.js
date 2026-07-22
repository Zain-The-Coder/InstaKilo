import User from "../../models/user.model.js";

/**
 * @desc    Update current user profile (Bio, profile pic, name, website, gender, isPrivate)
 * @route   PATCH /api/v1/users/me
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const {bio, website, gender, profilePicture, isPrivate } = req.body;

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (website !== undefined) updates.website = website;
    if (gender !== undefined) updates.gender = gender;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
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
