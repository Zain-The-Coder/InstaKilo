import Story from "../../models/story.model.js";

/**
 * @desc    Manual delete a story before auto-expiry
 * @route   DELETE /api/v1/stories/:id
 * @access  Private
 */
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found or already expired.",
      });
    }

    // Authorization check: Only story owner can delete
    if (story.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this story.",
      });
    }

    await Story.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteStory controller:", error);
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
