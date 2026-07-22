import Story from "../../models/story.model.js";
import { uploadImage } from "../../services/imagekit.service.js";

/**
 * @desc    Upload a new story (active for 24 hours)
 * @route   POST /api/v1/stories
 * @access  Private
 */
export const createStory = async (req, res) => {
  try {
    const authorId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image/video for the story.",
      });
    }

    // Generate custom filename
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `story_${authorId}_${Date.now()}.${fileExtension}`;

    // Upload to ImageKit (DEV MODE automatically mocks this if credentials are missing)
    const mediaUrl = await uploadImage(req.file.buffer, fileName, "/stories");

    // Create story in database
    const newStory = await Story.create({
      author: authorId,
      media: mediaUrl,
    });

    const populatedStory = await newStory.populate(
      "author",
      "_id username profilePicture isVerified"
    );

    return res.status(201).json({
      success: true,
      message: "Story uploaded successfully. It will be active for 24 hours.",
      data: populatedStory,
    });
  } catch (error) {
    console.error("Error in createStory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to upload story.",
    });
  }
};
