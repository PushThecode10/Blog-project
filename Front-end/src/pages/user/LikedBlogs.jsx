import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const LikedBlogs = () => {
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (!user?.id) {
          setMessage("Please login to view your liked blogs.");
          setLoading(false);
          return;
        }
        
        const res = await API.get(`/blogs/liked`);
        console.log("API Response:", res.data);
        
        setLikedBlogs(res.data?.likedBlogs || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked blogs:", error);
        setMessage("❌ Failed to load liked blogs");
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchLikes();
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 mt-10 ">
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

        {/* Error Message */}
        {message && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-700 font-medium">{message}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && likedBlogs.length === 0 && !message && (
          <div className="text-center py-20">
            <div className="mb-6">
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
            </div>
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

        {/* Blogs Grid */}
        {!loading && likedBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {blog.description?.slice(0, 120)}...
                  </p>

                  <Link
                    to={`/blog/${blog._id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all group"
                  >
                    Read Full Article
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
            ))}
          </div>
        )}

        {/* Blog Count */}
        {!loading && likedBlogs.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg">
              You have liked{" "}
              <span className="font-bold text-blue-600">{likedBlogs.length}</span>{" "}
              {likedBlogs.length === 1 ? "blog" : "blogs"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedBlogs;