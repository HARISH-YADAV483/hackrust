import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      author: req.user._id,
      image: req.file ? req.file.filename : "",
    });
    await blog.save();

    // Update user's blogsCount
    await User.findByIdAndUpdate(req.user._id, { $inc: { blogsCount: 1 } });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to create blog", error: err.message });
  }
};

export const getApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "approved" }).populate("author", "name");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
  }
};

export const getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "pending" }).populate("author", "name");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending blogs", error: err.message });
  }
};

export const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const blog = await Blog.findByIdAndUpdate(id, { status }, { new: true });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to update blog status", error: err.message });
  }
};
