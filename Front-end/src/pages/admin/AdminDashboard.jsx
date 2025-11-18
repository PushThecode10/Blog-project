import Header from "../../components/Header.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import React, { useState, useEffect } from "react";
import API from "../../axios.js";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    likedBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const blogsRes = await API.get("/blogs/all?admin=true");
        const allBlogs = blogsRes.data.blogs || [];
        const published = allBlogs.filter((b) => b.isPublished).length;
        const draft = allBlogs.filter((b) => !b.isPublished).length;

        const likedRes = await API.get("/blogs/liked");
        const likedBlogs = (likedRes.data?.likedBlogs || []).filter(
          (b) => b !== null
        );
        console.log("Raw likedBlogs:", likedRes.data?.likedBlogs);
        console.log("LIKED RESPONSE:", likedBlogs);

        setStats({
          totalBlogs: allBlogs.length,
          publishedBlogs: published,
          draftBlogs: draft,
          likedBlogs: likedBlogs.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <Header />

      <div className="ml-64 p-8">
        {/* Welcome Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your blog overview for today
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="animate-ping rounded-full h-10 w-10 bg-blue-400 opacity-75"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Total Blogs Card */}
              <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-30 p-3 rounded-lg backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <span className="text-5xl font-bold text-white">
                      {stats.totalBlogs}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Total Blogs
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {stats.publishedBlogs} Published, {stats.draftBlogs} Drafts
                  </p>
                </div>
              </div>

              {/* Total Likes Card */}
              <div className="group relative bg-gradient-to-br from-pink-500 to-rose-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-30 p-3 rounded-lg backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <span className="text-5xl font-bold text-white">
                      {stats.likedBlogs}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Liked Blogs
                  </h3>
                  <p className="text-pink-100 text-sm">Across all your blogs</p>
                </div>
              </div>

              {/* Published Blogs Card */}
              <div className="group relative bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-30 p-3 rounded-lg backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-5xl font-bold text-white">
                      {stats.publishedBlogs}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Published
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    Live on your website
                  </p>
                </div>
              </div>

              {/* Draft Blogs Card */}
              <div className="group relative bg-gradient-to-br from-amber-500 to-orange-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-30 p-3 rounded-lg backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <span className="text-5xl font-bold text-white">
                      {stats.draftBlogs}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Drafts
                  </h3>
                  <p className="text-amber-100 text-sm">
                    Waiting to be published
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">⚡</span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate("/addBlog")}
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Create Blog
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Write a new blog post
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/addCatagory")}
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Manage Categories
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Organize your content
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/allBlogs")}
                  className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      All Blogs
                    </h3>
                    <p className="text-gray-600 text-sm">
                      View and manage blogs
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
