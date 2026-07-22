import Story from "../../models/story.model.js";

/**
 * @desc    Track "Seen by" state for a story
 * @route   POST /api/v1/stories/:id/view
 * @access  Private
 */
export const viewStory = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found or expired.",
      });
    }

    // Check if story is already expired
    if (new Date() > new Date(story.expiresAt)) {
      return res.status(410).json({
        success: false,
        message: "Story has expired.",
      });
    }

    // Check if user has already viewed the story
    if (!story.views.includes(currentUserId)) {
      story.views.push(currentUserId);
      await story.save();
    }

    return res.status(200).json({
      success: true,
      message: "Story view tracked successfully.",
    });
  } catch (error) {
    console.error("Error in viewStory controller:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
