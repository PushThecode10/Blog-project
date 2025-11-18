import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../axios";

const LikedBlogs = () => {
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.auth.user);

  // Fetch liked blogs
  const fetchLikes = async () => {
    try {
      if (!user?.id) {
        setMessage("Please login to view your liked blogs.");
        setLoading(false);
        return;
      }

      const res = await API.get("/blogs/liked");
      console.log("API response:", res.data);

      const blogs = (res.data?.likedBlogs || []).filter((b) => b !== null);
      setLikedBlogs(blogs);
      setFilteredBlogs(blogs);

      // Extract unique categories
      const uniqueCategories = [...new Set(blogs.map(b => b.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching liked blogs:", error);
      setMessage("❌ Failed to load liked blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchLikes();
  }, [user?.id]);

  // Remove blog from liked list (unlike)
  const handleUnlike = async (blogId) => {
    try {
      console.log("Unliking blog:", blogId);
      
      // Call the like endpoint (it toggles, so it will unlike)
      const res = await API.post(`/blogs/like/${blogId}`);
      console.log("Unlike response:", res.data);
      
      // Remove from local state immediately
      const updatedLikedBlogs = likedBlogs.filter(b => b._id !== blogId);
      setLikedBlogs(updatedLikedBlogs);
      setFilteredBlogs(prev => prev.filter(b => b._id !== blogId));
      
      // Update categories based on remaining blogs
      const uniqueCategories = [...new Set(updatedLikedBlogs.map(b => b.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
      
      // Reset filter to 'all' if current category becomes empty
      if (activeFilter !== "all") {
        const remainingInCategory = updatedLikedBlogs.filter(b => b.category?.name === activeFilter);
        if (remainingInCategory.length === 0) {
          setActiveFilter("all");
          setFilteredBlogs(updatedLikedBlogs);
        }
      }
      
      setMessage("💔 Blog removed from liked list");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error unliking blog:", error);
      setMessage("❌ Failed to unlike blog");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 mt-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">❤️</span>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Your Liked Blogs
            </h1>
          </div>
          <p className="text-gray-600 text-base ml-8">
            A collection of articles you've saved for later
          </p>
        </div>

        {/* Filter Buttons */}
        {likedBlogs.length > 0 && categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              All ({likedBlogs.length})
            </button>
          </div>
        )}

        {message && (
          <div className={`mb-8 border-l-4 p-4 rounded-r-lg ${
            message.includes("❌") 
              ? "bg-red-50 border-red-500" 
              : "bg-green-50 border-green-500"
          }`}>
            <p className={`font-medium ${
              message.includes("❌") ? "text-red-700" : "text-green-700"
            }`}>
              {message}
            </p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {!loading && likedBlogs.length === 0 && !message && (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No liked blogs yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring and like the blogs you love!
            </p>
            <Link
              to="/blog"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explore Blogs
            </Link>
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && likedBlogs.length > 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No blogs found in the "{activeFilter}" category.
            </p>
          </div>
        )}

        {!loading && filteredBlogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => {
                if (!blog) return null;
                return (
                  <div
                    key={blog._id || index}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative"
                  >
                    {/* Unlike Button */}
                    <button
                      onClick={() => handleUnlike(blog._id)}
                      className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200 group/unlike"
                      title="Remove from liked"
                    >
                      <svg
                        className="w-6 h-6 text-red-500 group-hover/unlike:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>

                    <div className="relative overflow-hidden h-56">
                      <img
                        src={blog.thumbnail || "/default-thumb.jpg"}
                        alt={blog.title || "Untitled"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {blog.category?.name && (
                        <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-md">
                          {blog.category.name}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                          {blog.title || "Untitled Blog"}
                        </h2>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {blog.description?.slice(0, 120) || "No description"}...
                      </p>

                      <Link
                        to={`/blogs/${blog._id}`}
                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all group/link"
                      >
                        Read Full Article
                        <svg
                          className="w-5 h-5 group-hover/link:translate-x-1 transition-transform"
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
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-lg">
                {activeFilter === "all" ? (
                  <>
                    You have liked{" "}
                    <span className="font-bold text-blue-600">
                      {likedBlogs.length}
                    </span>{" "}
                    {likedBlogs.length === 1 ? "blog" : "blogs"}
                  </>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-bold text-blue-600">
                      {filteredBlogs.length}
                    </span>{" "}
                    {filteredBlogs.length === 1 ? "blog" : "blogs"} in{" "}
                    <span className="font-semibold">{activeFilter}</span>
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LikedBlogs;