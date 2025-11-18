import React, { useEffect, useState } from "react";
import { Trash2, FolderPlus } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import Header from "../../components/Header.jsx";
import API from "../../axios.js";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories/getAllCategories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/categories/createcategory", {
        name,
        description,
      });
      if (res.status === 201) {
        setMessage("✅ Category added successfully!");
        setName("");
        setDescription("");
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add category");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.delete(`/categories/deleteCategory/${id}`);
      setMessage("🗑️ Category deleted");
      fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <div className="max-w-7xl mx-auto mt-6 flex gap-6 px-4">
        {/* Left Side: Category List */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 ml-50">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            All Categories
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-[#40a7cf] to-[#da4453] text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.length > 0 ? (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium text-gray-800">{cat.name}</td>
                      <td className="p-3 text-gray-600">{cat.description}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Add Category Form */}
        <div className="w-96 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Add Category
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter category name"
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#40a7cf] outline-none resize-none"
              />
            </div>

            {message && (
              <p
                className={`text-center font-medium ${
                  message.includes("✅")
                    ? "text-green-600"
                    : message.includes("🗑️")
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <FolderPlus size={20} />
              <span>Add Category</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
