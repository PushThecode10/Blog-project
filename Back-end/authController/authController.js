import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";
import {Redis} from '../server.js'

// --------------------
// ✅ Register User (role always 'user')
// --------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: "user" });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------
// ✅ User Login
// --------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (user.role !== "user")
      return res.status(403).json({ success: false, message: "Access denied for admin accounts" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const accessToken = generateToken(user._id, process.env.ACCESS_TOKEN_SECRET, "15m");
    const refreshToken = generateToken(user._id, process.env.REFRESH_TOKEN_SECRET, "7d");
     await Redis.set(
      `refreshToken:${user._id}`, refreshToken, { EX: 7 * 24 * 60 * 60 }
     )
    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken, // Return accessToken for localStorage
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------
// ✅ Admin Login
// --------------------
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const admin = await User.findOne({ email });
    if (!admin) return res.status(400).json({ success: false, message: "Admin not found" });

    if (admin.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const accessToken = generateToken(admin._id, process.env.ACCESS_TOKEN_SECRET, "15m");
    const refreshToken = generateToken(admin._id, process.env.REFRESH_TOKEN_SECRET, "7d");

    await Redis.set(
      `refreshToken:${admin._id}`, refreshToken, { EX: 7 * 24 * 60 * 60 } 
    )
    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      accessToken, // Return accessToken for localStorage
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------
// ✅ Refresh Access Token
// --------------------

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return res.status(401).json({ success: false, message: "No refresh token provided" });

    // Decode refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Fetch stored refresh token from Redis
    const storedToken = await redis.get(`refresh:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateToken(decoded.id, process.env.ACCESS_TOKEN_SECRET, "15m");

    // Set cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
      message: "Access token refreshed"
    });

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
}
};
// --------------------
// ✅ Logout (both roles)
// --------------------

export const logoutUser = async (req, res) => {
  try {
    // user ID चाहिन्छ
    const userId = req.user?.id;

    // If logged-in user exists → remove refresh token from Redis
    if (userId) {
      await redis.del(`refresh:${userId}`);
    }

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// --------------------
// ✅ Get Me (for protected routes)
// --------------------
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};