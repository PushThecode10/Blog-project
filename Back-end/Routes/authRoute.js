// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
} from "../authController/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin); // Separate admin login endpoint

// Protected routes
router.post("/logout", protect, logoutUser);

export default router;
