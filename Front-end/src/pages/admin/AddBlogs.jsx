import React, { useState, useEffect } from "react";
import API from "../../axios.js";
import { useNavigate } from "react-router-dom";
import { Upload, ImagePlus } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import Header from "../../components/Header.jsx";

const AddBlogs = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // ✅ store fetched categories
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories/getAllCategories");
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isPublished", isPublished);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await API.post("/blogs/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        setMessage("✅ Blog added successfully!");
        setTimeout(() => navigate("/adminDashboard"), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add blog. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 ml-100 mt-4">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#40a7cf] to-[#da4453] bg-clip-text text-transparent">
          Add New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none"
              placeholder="Enter blog title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none"
              placeholder="Enter subtitle (optional)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none resize-none"
              placeholder="Write your blog content here..."
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center space-x-2 text-[#40a7cf] hover:text-[#da4453] font-medium">
                <ImagePlus size={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover border"
                />
              )}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 text-[#40a7cf] border-gray-300 rounded focus:ring-[#40a7cf]"
            />
            <label className="text-gray-700">Publish immediately</label>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-center font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#40a7cf] to-[#da4453] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Upload size={20} />
            <span>Add Blog</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;
