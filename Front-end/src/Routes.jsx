import Signup from "./pages/user/Signup.jsx";
import Login from "./pages/user/Login.jsx";
import About from "./pages/About.jsx";
import Contect from "./pages/Contect.jsx";
import Adminlogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Logout from "./pages/Logout.jsx";

import AddCategory from "./pages/admin/AddCatagory.jsx";
import PrivateRoute from "./PrivateLayout.jsx";

import Blogs from "./pages/Blog.jsx";
import TotalBlogs from "./pages/admin/TotalBlogs.jsx";
import BlogDetails from "./components/BlogDetails.jsx";
import HomePage from "./pages/HomePage.jsx";
import LikedBlogs from "./pages/user/LikedBlogs.jsx";

import { Layout } from "lucide-react";
import BlogForm from "./pages/admin/BlogForm.jsx";


// Public Routes (accessible to everyone, not logged in)
export const publicRoutes = [
  { path: "/", component: HomePage }, // Public homepage for non-logged users
  { path: "/about", component: About },
  { path: "/contact", component: Contect },
  { path: "/blog", component: Blogs }, // Public blog listing
  { path: "/blogs/:id", component: BlogDetails }, // Public blog details
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/adminLogin", component: Adminlogin },
  { path: "/logout", component: Logout}
];

// User Routes (for logged-in users only)
export const userRoutes = [
   // User homepage when logged in
  { path: "/like", component: LikedBlogs }, // Liked blogs for logged-in users
];

// Admin Routes (for admin users only)
export const adminRoutes = [
  { path: "/adminDashboard", component: AdminDashboard, Layout: PrivateRoute },
  { path: "/addBlog", component: BlogForm, Layout: PrivateRoute },
  { path: "/addBlog/:id", component: BlogForm, Layout: PrivateRoute },
  { path: "/addCatagory", component: AddCategory, Layout: PrivateRoute },
  { path: "/allBlogs", component: TotalBlogs, Layout: PrivateRoute },
  
 
  
];