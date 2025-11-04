import Signup from "./pages/user/Signup.jsx";
import Login from "./pages/user/Login.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/user/Blog.jsx";
import Contect from "./pages/Contect.jsx";
import Home from "./pages/Home.jsx";
import Adminlogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Logout from "./pages/Logout.jsx";
import AddBlogs from "./pages/admin/AddBlogs.jsx";
import AddCategory from "./pages/admin/AddCatagory.jsx";
import PrivateRoute from "./PrivateLayout.jsx";
import { Layout } from "lucide-react";
import TotalBlogs from "./pages/admin/TotalBlogs.jsx";
import UserHomePage from "./pages/user/UserHomePage.jsx";

export const myRoutes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/blog", component: Blog },
  { path: "/contect", component: Contect },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/adminLogin", component: Adminlogin },
  // {path:"/adminDashboard",component: AdminDashboard},
  { path:"/UserHomePage", component: UserHomePage }
];

export const PrivateLayout = [
  { path: "/adminDashboard", component: AdminDashboard, Layout: PrivateRoute },
  { path: "/logout", component: Logout, Layout: PrivateRoute},
  { path: "/addBlog", component: AddBlogs, Layout: PrivateRoute },
  { path: "/addCatagory", component: AddCategory, Layout: PrivateRoute},
  {path:"/allBlogs", component: TotalBlogs, Layout: PrivateRoute}
];
