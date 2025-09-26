import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/Comment.model.js";

export const activeCheck = async (req, res) => {
  try {
    return res.json({ message: "RUNNING" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
 

    await post.save();

    return res.status(200).json({ message: "post Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profile"
    );

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await user.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const post = await Post.findOne({ id: post_id });
    if (!post) {
      return res.status(404).json({ messag: "post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ messag: "Unauthorized" });
    }
    await Post.deletePost({ _id: post_id });
    return res.json({ messag: "Post delete" });
  } catch (error) {
    return res.status(500).json({ message: error.messag });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ messag: "user not found" });
    }
    const post = await Post.findOne({
      id: post_id,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      comment: commentBody,
    });
    await comment.save();
    return res.status(200).json({ message: "Comment Added" });
  } catch (error) {
    return res.status(500).json({ messag: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not fount" }).select("_id");
    }
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment  not found" });
    }
    if (comment.userId.toString() !== user.id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "Comment delete" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.likes = post.likes + 1;
    await post.save();

    return res.json({ message: "Likes Incremented" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
