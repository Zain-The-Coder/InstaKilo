import Message from "../../models/message.model.js";

/**
 * @desc    Send a message to a user via HTTP
 * @route   POST /api/v1/messages/:otherUserId
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { text } = req.body;
    const currentUserId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message text is required.",
      });
    }

    const message = await Message.create({
      sender: currentUserId,
      receiver: otherUserId,
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to send message.",
    });
  }
};
