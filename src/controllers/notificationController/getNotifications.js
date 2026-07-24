import Notification from "../../models/notification.model.js";

/**
 * @desc    Get current user's notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const notifications = await Notification.find({ receiver: currentUserId })
      .populate("sender", "_id username fullName profilePicture isVerified")
      .populate("post", "_id image caption")
      .sort({ createdAt: -1 })
      .limit(50); // limit to 50 for performance

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve notifications.",
    });
  }
};
