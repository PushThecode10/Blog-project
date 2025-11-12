// src/pages/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../axios.js";
import Navbar from "../components/Navbar.jsx";
import { Button } from "./ui/button.jsx";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log("Fetching blog with ID:", id);
        const res = await API.get(`/blogs/blog/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load blog");
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className=" container mx-auto px-4 py-8 mt-10 ml-20">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 mx-auto">
          <Button onClick={() => navigate(-1)} className="mb-4 cursor-pointer">
            ← Back
          </Button>
          <img
            src={
              blog.thumbnail ||
              "https://via.placeholder.com/600x350?text=No+Image"
            }
            alt={blog.title}
            className="w-full max-w-3xl h-auto object-contain rounded-lg mb-6 mx-auto"
          />
          <h1 className="text-3xl font-bold mb-2 text-gray-800 text-transform: uppercase">
            {blog.title}
          </h1>
          <p className="text-gray-500 mb-4 text-transform: uppercase">{blog.subtitle}</p>
          <p className="text-gray-700 leading-relaxed mb-6 ">
            {blog.description}
          </p>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Category: {blog.category?.name || "Uncategorized"}</span>
            <span>Status: {blog.isPublished ? "Published" : "Draft"}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;
