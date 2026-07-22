import Story from "../../models/story.model.js";
import Follow from "../../models/follow.model.js";

/**
 * @desc    Get current active stories of users the logged-in user is following
 * @route   GET /api/v1/stories/feed
 * @access  Private
 */
export const getStoriesFeed = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get following user IDs
    const followingRelations = await Follow.find({ follower: currentUserId }).select("following");
    const followingIds = followingRelations.map((rel) => rel.following);

    // Include own ID to see your own active stories in the feed row
    const feedUserIds = [...followingIds, currentUserId];

    // Find stories of feed users that have not expired yet
    const activeStories = await Story.find({
      author: { $in: feedUserIds },
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate("author", "_id username profilePicture isVerified");

    // Group stories by user (so frontend gets a list of users, each with their own stories array)
    const groupedStories = activeStories.reduce((acc, story) => {
      const authorId = story.author._id.toString();
      if (!acc[authorId]) {
        acc[authorId] = {
          user: story.author,
          stories: [],
        };
      }
      acc[authorId].stories.push({
        _id: story._id,
        media: story.media,
        viewsCount: story.views.length,
        hasSeen: story.views.includes(currentUserId),
        createdAt: story.createdAt,
      });
      return acc;
    }, {});

    // Convert object values to clean array
    const resultFeed = Object.values(groupedStories);

    return res.status(200).json({
      success: true,
      data: resultFeed,
    });
  } catch (error) {
    console.error("Error in getStoriesFeed controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve stories feed.",
    });
  }
};
