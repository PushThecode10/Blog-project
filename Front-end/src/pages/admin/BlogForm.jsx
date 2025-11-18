import React, { useEffect, useState } from "react";
import API from "../../axios.js";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import Header from "../../components/Header.jsx";
import { Upload, ImagePlus } from "lucide-react";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    isPublished: false,
  });

  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // for fetching categories
  const [loadingData, setLoadingData] = useState(false); // for fetching blog data

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await API.get("/categories/getAllCategories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        alert("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      setLoadingData(true);
      try {
         const res = await API.get(`/blogs/blog/${id}?admin=true`);
        const blog = res.data.blog;
        setFormData({
          title: blog.title || "",
          subtitle: blog.subtitle || "",
          description: blog.description || "",
          category: blog.category?._id || "",
          isPublished: blog.isPublished || false,
        });
        setPreview(blog.thumbnail || null);
      } catch (err) {
        console.error("Failed to fetch blog", err);
        alert("Failed to load blog data.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchBlog();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle thumbnail upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("isPublished", formData.isPublished);
      if (thumbnail) data.append("thumbnail", thumbnail);

      if (isEditMode) {
        const res = await API.put(`/blogs/update/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 200) {
          alert("Blog updated successfully!");
          navigate("/adminDashboard");
        } else {
          alert("Failed to update blog.");
        }
      } else {
        const res = await API.post("/blogs/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 201) {
          alert("Blog added successfully!");
          navigate("/adminDashboard");
        } else {
          alert("Failed to add blog.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 ml-100 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200"
        >
          Back
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 mt-4">
          {isEditMode ? "Update Blog" : "Create New Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none"
              placeholder="Enter subtitle (optional)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none resize-none"
              placeholder="Write your blog content here..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

          {/* Thumbnail */}
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

          {/* Publish */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 text-[#40a7cf] border-gray-300 rounded focus:ring-[#40a7cf]"
            />
            <label className="text-gray-700">Publish immediately</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#40a7cf] to-[#da4453] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Upload size={20} />
            <span>{isEditMode ? "Update Blog" : "Add Blog"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
