import Comment from "../../models/comment.model.js";
import Post from "../../models/post.model.js";

/**
 * @desc    Add a comment to a post
 * @route   POST /api/v1/posts/:id/comments
 * @access  Private
 */
export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const currentUserId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required.",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Create comment document
    const comment = await Comment.create({
      post: postId,
      author: currentUserId,
      text: text,
    });

    // Reference comment in Post document
    post.comments.push(comment._id);
    await post.save();

    // Populate author details
    const populatedComment = await comment.populate(
      "author",
      "_id username profilePicture isVerified"
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: populatedComment,
    });
  } catch (error) {
    console.error("Error in addComment controller:", error);
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
