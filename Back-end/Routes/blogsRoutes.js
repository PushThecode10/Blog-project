import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  likeBlog,
  getLikedBlogs,
  unlikeBlog,
} from "../authController/blogController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.get("/all", getAllBlogs);
router.get("/blog/:id", getBlogById);

// ✅ Protected routes (authenticated users)
router.post("/like/:id", protect, likeBlog); // Toggle like/unlike
router.delete("/unlike/:id", protect, unlikeBlog); // Explicit unlike endpoint
router.get("/liked", protect, getLikedBlogs);

// ✅ Admin-only routes
router.post(
  "/create",
  protect,
  adminOnly,
  upload.single("thumbnail"),
  createBlog
);
router.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.single("thumbnail"),
  updateBlog
);
router.delete("/delete/:id", protect, adminOnly, deleteBlog);
router.put("/update/:id", protect,adminOnly,upload.single("thumbnail"),updateBlog )

export default router;