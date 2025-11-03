import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../authController/categoryController.js";
import {adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.post("/createcategory",protect,adminOnly,createCategory);
router.put("/updateCategory/:id",protect,adminOnly, updateCategory);
router.delete("/deleteCategory/:id",protect,adminOnly, deleteCategory);

// Public routes
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", getCategoryById);

export default router;
