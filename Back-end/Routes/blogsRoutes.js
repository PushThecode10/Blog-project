// routes/blogRoutes.js
import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  likeBlog,
} from "../authController/blogController.js"; // ✅ corrected path
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);

// ✅ Protected routes (authenticated users)
router.post("/likes/:id", protect, likeBlog);

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

export default router;
