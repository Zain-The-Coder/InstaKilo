import Post from "../../models/post.model.js";

/**
 * @desc    Update post caption (Only owner can edit)
 * @route   PATCH /api/v1/posts/:id
 * @access  Private
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    const currentUserId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Authorization check
    if (post.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post.",
      });
    }

    // Update fields
    if (caption !== undefined) post.caption = caption;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Error in updatePost controller:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
