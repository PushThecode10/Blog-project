import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Header from "../../components/Header.jsx";
import API from "../../axios.js";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TotalBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all blogs (admin)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs/all?admin=true");
        setBlogs(res.data.blogs || []);
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to fetch blogs");
      }
    };
    fetchBlogs();
  }, []);

  // ✅ Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await API.delete(`/blogs/delete/${id}`);
      if (res.status === 200) {
        setMessage("🗑️ Blog deleted successfully!");
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <div className="max-w-[76rem] mx-auto bg-white rounded-2xl shadow-lg p-8 ml-70 mt-3">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#40a7cf] to-[#da4453] bg-clip-text text-transparent">
          All Blogs
        </h2>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.includes("✅") || message.includes("🗑️")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {blogs.length === 0 ? (
          <p className="text-gray-500 text-center">No blogs found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 ml-1">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={
                    blog.thumbnail ||
                    "https://via.placeholder.com/400x250?text=No+Image"
                  }
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {blog.subtitle || ""}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {blog.description}
                  </p>

                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="px-3 py-1 bg-[#40a7cf]/10 text-[#40a7cf] rounded-full">
                      {blog.category?.name || "Uncategorized"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        blog.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/admin/updateBlog/${blog._id}`)}
                      className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-[#40a7cf] to-[#4dc0b5] text-white text-sm rounded-lg hover:opacity-90"
                    >
                      <Pencil size={16} />
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-[#da4453] to-[#ff6b6b] text-white text-sm rounded-lg hover:opacity-90"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalBlogs;
