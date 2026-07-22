import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";
import Comment from "../../models/comment.model.js"; // registers Comment schema

/**
 * @desc    Get all posts of a specific user by username/id
 * @route   GET /api/v1/users/:usernameOrId/posts
 * @access  Private
 */
export const getUserPosts = async (req, res) => {
  try {
    const { usernameOrId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Check if dynamic param is mongoose ObjectId or username
    let user;
    const isObjectId = usernameOrId.match(/^[0-9a-fA-F]{24}$/);

    if (isObjectId) {
      user = await User.findById(usernameOrId);
    } else {
      user = await User.findOne({ username: usernameOrId.toLowerCase().trim() });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Retrieve user's posts
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "_id username fullName profilePicture isVerified")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "_id username profilePicture isVerified",
        },
      });

    const totalPosts = await Post.countDocuments({ author: user._id });

    return res.status(200).json({
      success: true,
      count: posts.length,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      data: posts,
    });
  } catch (error) {
    console.error("Error in getUserPosts controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
