import Post from "../../models/post.model.js";
import Follow from "../../models/follow.model.js";
import Comment from "../../models/comment.model.js"; // registers Comment schema

/**
 * @desc    Get Feed Posts (From users current user is following)
 * @route   GET /api/v1/posts/feed
 * @access  Private
 */
export const getFeedPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get following user IDs
    const followingRelations = await Follow.find({ follower: currentUserId }).select("following");
    const followingIds = followingRelations.map((rel) => rel.following);

    // Include user's own posts in their feed as well
    const feedUserIds = [...followingIds, currentUserId];

    const posts = await Post.find({ author: { $in: feedUserIds } })
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

    const totalPosts = await Post.countDocuments({ author: { $in: feedUserIds } });

    return res.status(200).json({
      success: true,
      count: posts.length,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      data: posts,
    });
  } catch (error) {
    console.error("Error in getFeedPosts controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve home feed.",
    });
  }
};
