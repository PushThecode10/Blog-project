import Blog from "../models/blogProduct.js";
import LikeBlog from "../models/likeModel.js";
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

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!blog.isPublished && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ message: "This blog is not published yet" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeBlog = async (req, res) => {
  const { id } = req.params; // Get blog ID from URL params
  const userId = req.user._id; // Get user ID from the authenticated user

  try {
    // Check if the blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user has already liked this blog
    const existingLike = await LikeBlog.findOne({ User: userId, blog: id });
    if (existingLike) {
      // If already liked, unlike the blog
      await LikeBlog.deleteOne({ User: userId, blog: id });
      return res.status(200).json({ message: "Blog unliked" });
    }

    // Otherwise, create a new like for the blog
    const newLike = new LikeBlog({
      User: userId,
      blog: id,
    });

    await newLike.save();

    return res.status(200).json({ message: "Blog liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


export const getLikedBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all liked blogs for the user from the LikeBlog model
    const likedBlogs = await LikeBlog.find({ User: userId }).populate("blog");

    if (!likedBlogs.length) {
      return res.status(200).json({ likedBlogs: [] }); // ✅ Return empty array instead of 404
    }

    // Extract the blogs from the populated 'blog' field
    const blogs = likedBlogs.map(like => like.blog);

    // ✅ Changed 'blogs' to 'likedBlogs' to match frontend
    res.status(200).json({ likedBlogs: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load liked blogs" });
  }
};

// Unlike a blog
export const unlikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Assuming you have user from auth middleware

    // Find the blog
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: '❌ Blog not found' });
    }

    // Check if user has liked the blog
    const hasLiked = blog.likes.includes(userId);
    
    if (!hasLiked) {
      return res.status(400).json({ message: '⚠️ You haven\'t liked this blog yet' });
    }

    // Remove user from likes array
    blog.likes = blog.likes.filter(like => like.toString() !== userId.toString());
    await blog.save();

    res.status(200).json({ 
      message: '✅ Blog unliked successfully',
      liked: false,
      likesCount: blog.likes.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Server error' });
  }
};