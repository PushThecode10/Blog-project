import Blog from "../models/blogProduct.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Admin Controllers
export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, description, category, isPublished } = req.body;

    let thumbnailUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      thumbnailUrl = result.secure_url;
    }
    const blog = new Blog({
      title,
      subtitle,
      description,
      thumbnail: thumbnailUrl,
      author: req.user._id,
      category,
      isPublished: isPublished || false,
    });
    await blog.save();
    await blog.populate("author", "name email");
    await blog.populate("category", "name");
    res.status(201).json({ message: "Blog created", blog });
  } catch (error) {
   res.status(500).json({ message: error.message });

  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, category, isPublished } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (req.file) {
      if (blog.thumbnail) {
        const publicId = blog.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      blog.thumbnail = result.secure_url;
    }

    if (title) blog.title = title;
    if (subtitle !== undefined) blog.subtitle = subtitle;
    if (description !== undefined) blog.description = description;
    if (category) blog.category = category;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();
    await blog.populate("author", "name email");

    res.status(200).json({ message: "Blog updated", blog });
  } catch (error) {
    throw new Error({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.thumbnail) {
      const publicId = blog.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    throw new Error({ success: false, message: error.message });
  }
};

// Public Controllers
export const getAllBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let query = { isPublished: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Blog.countDocuments(query);

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalBlogs: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("author", "name email")
      .populate("category", "name")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name email" },
      });

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!blog.isPublished && (!req.user || req.user.role !== "admin")) {
      return res
        .status(403)
        .json({ message: "This blog is not published yet" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    throw new Error({ success: false, message: error.message });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const likedIndex = blog.likes.indexOf(userId);
    if (likedIndex === -1) {
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Blog liked" });
    }
    blog.likes.splice(likedIndex, 1);
    await blog.save();
    res.status(200).json({ message: "Blog unliked" });
  } catch (error) {
    throw new Error({ success: false, message: error.message });
  }
};
export const getBlogLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("likes", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ likes: blog.likes, totalLikes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
