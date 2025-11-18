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
    res.status(500).json({ message: error.message });
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

    // Delete all likes associated with this blog
    await LikeBlog.deleteMany({ blog: id });

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public Controllers
export const getAllBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, admin } = req.query;

    let query = {};
    
    // If not admin view, only show published blogs
    if (admin !== "true") {
      query.isPublished = true;
    }
    
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

    // Get like counts for each blog
    const blogsWithLikeCounts = await Promise.all(
      blogs.map(async (blog) => {
        const likeCount = await LikeBlog.countDocuments({ blog: blog._id });
        return {
          ...blog.toObject(),
          likeCount,
        };
      })
    );

    const count = await Blog.countDocuments(query);

    res.status(200).json({
      blogs: blogsWithLikeCounts,
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
    const { admin } = req.query; // Add this line

    const blog = await Blog.findById(id)
      .populate("author", "name email")
      .populate("category", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    
    // Only check publication status if NOT in admin mode
    if (admin !== "true" && !blog.isPublished && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ message: "This blog is not published yet" });
    }

    // Get like count for this blog
    const likeCount = await LikeBlog.countDocuments({ blog: id });

    // Check if current user has liked this blog (if authenticated)
    let isLikedByUser = false;
    if (req.user) {
      const existingLike = await LikeBlog.findOne({
        User: req.user._id,
        blog: id,
      });
      isLikedByUser = !!existingLike;
    }

    res.status(200).json({
      blog: {
        ...blog.toObject(),
        likeCount,
        isLikedByUser,
      },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

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
      const newLikeCount = await LikeBlog.countDocuments({ blog: id });
      
      return res.status(200).json({
        message: "Blog unliked",
        liked: false,
        likeCount: newLikeCount,
      });
    }

    // Otherwise, create a new like for the blog
    const newLike = new LikeBlog({
      User: userId,
      blog: id,
    });

    await newLike.save();
    
    const newLikeCount = await LikeBlog.countDocuments({ blog: id });

    return res.status(200).json({
      message: "Blog liked successfully",
      liked: true,
      likeCount: newLikeCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const getLikedBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all liked blogs for the user from the LikeBlog model
    const likedBlogs = await LikeBlog.find({ User: userId }).populate({
      path: "blog",
      populate: [
        { path: "category", select: "name" },
        { path: "author", select: "name email" }
      ],
    });

    if (!likedBlogs.length) {
      return res.status(200).json({ likedBlogs: [] });
    }

    // Get like counts for each blog
    const blogsWithLikeCounts = await Promise.all(
      likedBlogs.map(async (like) => {
        if (!like.blog) return null;
        
        const likeCount = await LikeBlog.countDocuments({ blog: like.blog._id });
        return {
          ...like.blog.toObject(),
          likeCount,
          isLikedByUser: true,
        };
      })
    );

    // Filter out null values (in case some blogs were deleted)
    const validBlogs = blogsWithLikeCounts.filter((blog) => blog !== null);

    res.status(200).json({ likedBlogs: validBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load liked blogs" });
  }
};

// Unlike a blog (alternative endpoint)
export const unlikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the blog
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: "❌ Blog not found" });
    }

    // Check if user has liked the blog
    const existingLike = await LikeBlog.findOne({ User: userId, blog: id });
    
    if (!existingLike) {
      return res.status(400).json({ message: "⚠️ You haven't liked this blog yet" });
    }

    // Remove the like
    await LikeBlog.deleteOne({ User: userId, blog: id });
    
    // Get updated like count
    const newLikeCount = await LikeBlog.countDocuments({ blog: id });

    res.status(200).json({ 
      message: "✅ Blog unliked successfully",
      liked: false,
      likeCount: newLikeCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Server error" });
  }
};