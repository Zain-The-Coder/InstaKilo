import Message from "../../models/message.model.js";

/**
 * @desc    Get chat message history with a specific user
 * @route   GET /api/v1/messages/:otherUserId
 * @access  Private
 */
export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 }); // Oldest first

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve messages.",
    });
  }
};
