import React, { useState, useEffect } from "react";
import API from "../axios.js";
import Navbar from "../components/Navbar.jsx";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvide.jsx";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [likedBlogIds, setLikedBlogIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch all blogs and liked status from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all published blogs
        const blogsRes = await API.get("/blogs/all");
        const allBlogs = blogsRes.data.blogs || [];
        setBlogs(allBlogs);

        // If user is logged in, fetch their liked blogs from backend
        if (user) {
          try {
            const likedRes = await API.get("/blogs/liked");
            const likedBlogs = likedRes.data?.likedBlogs || [];
            const likedIds = new Set(
              likedBlogs.map((blog) => blog?._id).filter(Boolean)
            );
            setLikedBlogIds(likedIds);
            console.log("Liked blog IDs loaded from backend:", Array.from(likedIds));
          } catch (error) {
            console.log("Could not fetch liked blogs:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setMessage("❌ Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle like/unlike toggle
  const handleLike = async (blogId) => {
    if (!user) {
      setMessage("⚠️ Please login first to like this blog!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const res = await API.post(`/blogs/like/${blogId}`);
      const isLiked = res.data.liked;
      const newLikeCount = res.data.likeCount;

      console.log(`Blog ${blogId} - Liked: ${isLiked}, Count: ${newLikeCount}`);

      // Update likedBlogIds Set based on backend response
      setLikedBlogIds((prev) => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(blogId);
          console.log("Added to liked:", blogId);
        } else {
          newSet.delete(blogId);
          console.log("Removed from liked:", blogId);
        }
        return newSet;
      });

      // Update the blog's like count in the list
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId ? { ...blog, likeCount: newLikeCount } : blog
        )
      );

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error toggling like:", err);
      setMessage("❌ Failed to like blog");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header Section */}
        <h2 className="text-4xl font-bold mb-6 mt-14 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">
          All Blogs
        </h2>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-3 rounded-lg text-center font-medium ${
            message.includes("✅") 
              ? "bg-green-100 text-green-700" 
              : message.includes("⚠️")
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No blogs found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {blogs.map((blog) => {
              const isLiked = likedBlogIds.has(blog._id);
              
              return (
                <article
                  key={blog._id}
                  className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Image Section */}
                  <Link to={`/blogs/${blog._id}`} className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={blog.thumbnail || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={blog.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-1">
                    <Link 
                      to={`/blogs/${blog._id}`} 
                      className="text-2xl font-semibold text-gray-800 mb-2 hover:text-cyan-600 transition-colors line-clamp-2"
                    >
                      {blog.title}
                    </Link>

                    {blog.subtitle && (
                      <p className="text-gray-500 mb-2 text-sm font-medium">{blog.subtitle}</p>
                    )}
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {blog.description}
                    </p>

                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                        {blog.category?.name || "Uncategorized"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        blog.isPublished 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(blog._id)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          isLiked
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        {isLiked ? (
                          <AiFillLike className="text-lg" />
                        ) : (
                          <AiOutlineLike className="text-lg" />
                        )}
                        <span className="text-sm">{isLiked ? "Unlike" : "Like"}</span> 
                      </button>

                      <Link
                        to={`/blogs/${blog._id}`}
                        className="inline-flex items-center gap-1 text-cyan-600 font-semibold hover:gap-2 transition-all text-sm group/link"
                      >
                        Read More
                        <svg
                          className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blogs;