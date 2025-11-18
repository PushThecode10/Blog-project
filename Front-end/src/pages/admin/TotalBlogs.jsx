import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Header from "../../components/Header.jsx";
import API from "../../axios.js";
import { Trash2, Pencil, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

const TotalBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedBlogIds, setLikedBlogIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch blogs + liked blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await API.get("/blogs/all?admin=true");
        const allBlogs = blogsRes.data.blogs || [];

        try {
          const likedRes = await API.get("/blogs/liked");
          const likedBlogs = likedRes.data?.likedBlogs || [];
          const likedIds = new Set(
            likedBlogs.map((blog) => blog?._id).filter(Boolean)
          );
          setLikedBlogIds(likedIds);

          const blogsWithLikeStatus = allBlogs.map((blog) => ({
            ...blog,
            isLikedByUser: likedIds.has(blog._id),
          }));

          setBlogs(blogsWithLikeStatus);
          setFilteredBlogs(blogsWithLikeStatus);
        } catch {
          const blogsWithoutLikeStatus = allBlogs.map((blog) => ({
            ...blog,
            isLikedByUser: false,
          }));
          setBlogs(blogsWithoutLikeStatus);
          setFilteredBlogs(blogsWithoutLikeStatus);
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch blogs");
      }
    };
    fetchData();
  }, []);

  // Handle search from Header component
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // If search is empty, apply current filter
      handlefilterchange(activeFilter);
      return;
    }

    // Filter blogs by search query (title, category, description)
    const searchResults = blogs.filter((blog) => {
      const titleMatch = blog.title
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const categoryMatch = blog.category?.name
        ?.toLowerCase()
        .includes(query.toLowerCase());

      return titleMatch || categoryMatch;
    });

    setFilteredBlogs(searchResults);
  };

  // Re-filter when blogs or activeFilter changes
  useEffect(() => {
    if (!searchQuery) {
      handlefilterchange(activeFilter);
    } else {
      handleSearch(searchQuery);
    }
  }, [blogs, activeFilter]);

  // FILTERS
  const handlefilterchange = (type) => {
    setActiveFilter(type);
    setSearchQuery(""); // Clear search when changing filter

    if (type === "all") {
      setFilteredBlogs(blogs);
    } else if (type === "unpublished") {
      setFilteredBlogs(blogs.filter((b) => !b.isPublished));
    } else if (type === "mostLiked") {
      const sorted = blogs
        .filter((b) => b.isPublished)
        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      setFilteredBlogs(sorted);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await API.delete(`/blogs/delete/${id}`);
      if (res.status === 200) {
        setMessage("🗑️ Blog deleted successfully!");
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("❌ Error deleting blog");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header onSearch={handleSearch} />

      <div className="max-w-[76rem] mx-auto bg-white rounded-2xl shadow-lg p-8 ml-70 mt-3">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-l from-[#40a7cf] to-[#da4453] bg-clip-text text-transparent">
          All Blogs
        </h2>

        <button
          onClick={() => navigate("/addBlog")}
          className="flex items-center bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 mb-6"
        >
          <IoMdAdd className="mr-1 text-white text-2xl" />
          Create Blog
        </button>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => handlefilterchange("all")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All ({blogs.length})
          </button>

          <button
            onClick={() => handlefilterchange("mostLiked")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeFilter === "mostLiked"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            🔥 Most Liked
          </button>

          <button
            onClick={() => handlefilterchange("unpublished")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeFilter === "unpublished"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            📝 Unpublished ({blogs.filter((b) => !b.isPublished).length})
          </button>
        </div>
        {/* MESSAGE */}
        {message && (
          <p className="text-center mb-4 text-red-500 font-medium">{message}</p>
        )}

        {/* BLOG LIST */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? `No blogs found for "${searchQuery}"`
                : "No blogs found"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center justify-between bg-gray-50 rounded-lg shadow-sm p-2 hover:shadow-md duration-300"
              >
                {/* THUMBNAIL */}
                <img
                  src={blog.thumbnail || "https://via.placeholder.com/100"}
                  alt={blog.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                {/* BLOG INFO */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {blog.title}
                  </h3>

                  {activeFilter === "mostLiked" ? (
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1 w-fit">
                        <Heart size={12} className="fill-purple-700" />
                        {blog.likeCount || 0} Likes
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 truncate">
                        {blog.subtitle || blog.description?.slice(0, 50)}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                        <span className="px-2 py-0.5 bg-[#40a7cf]/10 text-[#40a7cf] rounded-full">
                          {blog.category?.name || "Uncategorized"}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            blog.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>

                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                          <Heart size={12} className="fill-purple-700" />
                          {blog.likeCount || 0} Likes
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                {activeFilter !== "mostLiked" && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/addBlog/${blog._id}`)}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#40a7cf] to-[#4dc0b5] text-white text-sm rounded-lg cursor-pointer"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#da4453] to-[#ff6b6b] text-white text-sm rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalBlogs;
