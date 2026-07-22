import Post from "../../models/post.model.js";
import Follow from "../../models/follow.model.js";
import Comment from "../../models/comment.model.js"; // registers Comment schema

/**
 * @desc    Explore Feed (Popular posts from accounts the user is NOT following)
 * @route   GET /api/v1/posts/explore
 * @access  Private
 */
export const getExplorePosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Explore grids usually have more posts (3x4 grid)
    const skip = (page - 1) * limit;

    // Get following user IDs to exclude their posts
    const followingRelations = await Follow.find({ follower: currentUserId }).select("following");
    const followingIds = followingRelations.map((rel) => rel.following);

    // Exclude own posts too
    const excludeIds = [...followingIds, currentUserId];

    // Find posts from non-followed accounts
    // Sorted by number of likes (popularity) & recency
    const posts = await Post.aggregate([
      { $match: { author: { $nin: excludeIds } } },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Populate post authors & comments on aggregated documents manually or via model populate
    const populatedPosts = await Post.populate(posts, [
      { path: "author", select: "_id username fullName profilePicture isVerified" },
      {
        path: "comments",
        populate: {
          path: "author",
          select: "_id username profilePicture isVerified",
        },
      },
    ]);

    const totalPosts = await Post.countDocuments({ author: { $nin: excludeIds } });

    return res.status(200).json({
      success: true,
      count: populatedPosts.length,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      data: populatedPosts,
    });
  } catch (error) {
    console.error("Error in getExplorePosts controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve explore feed.",
    });
  }
};
