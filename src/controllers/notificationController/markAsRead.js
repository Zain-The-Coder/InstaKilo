import Notification from "../../models/notification.model.js";

/**
 * @desc    Mark notifications as read
 * @route   PATCH /api/v1/notifications/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    await Notification.updateMany(
      { receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Notifications marked as read.",
    });
  } catch (error) {
    console.error("Error in markAsRead controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to mark notifications as read.",
    });
  }
};
