// controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";

// ✅ Register (only user — not admin)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Force the role to always be "user"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
     throw new Error({ success: false, message: error.message|| "Error while registering user", });
  }
};

// ✅ Login for normal users
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    // Prevent admin login from user route
    if (user.role !== "user") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied for admin accounts" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = generateToken(
      user._id,
      process.env.ACCESS_TOKEN_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      user._id,
      process.env.REFRESH_TOKEN_SECRET,
      "7d"
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
     throw new Error({ success: false, message: error.message || "Error while logging in user", });
  }
};

// ✅ Admin login (separate)
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });
    if (!admin)
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });

    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admin only." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = generateToken(
      admin._id,
      process.env.ACCESS_TOKEN_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      admin._id,
      process.env.REFRESH_TOKEN_SECRET,
      "7d"
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
     throw new Error({ success: false, message: error.message || "Error while logging in admin", });
  }
};

// ✅ Logout
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
     throw new Error({ success: false, message: error.message});
  }
};
