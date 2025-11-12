import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaHeart } from "react-icons/fa";
import { useAuth } from "../Context/AuthProvide";
import { useDispatch } from "react-redux";
import { logout as reduxLogout } from "../Features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, logout: contextLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    dispatch(reduxLogout());
    contextLogout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="fixed w-full top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="animate-pulse flex justify-between items-center">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(user?.id ? "/home" : "/")}>
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 lg:w-10 lg:h-10 dark:invert transition-transform hover:scale-110"
            />
            <h1 className="font-bold text-2xl lg:text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Logo
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-base">
            <NavLink
              to={user?.id ? "/home" : "/"}
              className={({ isActive }) =>
                `transition-all duration-300 hover:text-cyan-600 relative group ${
                  isActive ? "text-cyan-600 font-semibold" : "text-gray-700"
                }`
              }
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `transition-all duration-300 hover:text-cyan-600 relative group ${
                  isActive ? "text-cyan-600 font-semibold" : "text-gray-700"
                }`
              }
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-all duration-300 hover:text-cyan-600 relative group ${
                  isActive ? "text-cyan-600 font-semibold" : "text-gray-700"
                }`
              }
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-all duration-300 hover:text-cyan-600 relative group ${
                  isActive ? "text-cyan-600 font-semibold" : "text-gray-700"
                }`
              }
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>

            {user?.id && (
              <NavLink
                to="/like"
                className={({ isActive }) =>
                  `flex items-center gap-2 transition-all duration-300 hover:text-pink-600 relative group ${
                    isActive ? "text-pink-600 font-semibold" : "text-gray-700"
                  }`
                }
              >
                <FaHeart className="text-lg" />
                Liked Blogs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative flex items-center gap-3">
                <div
                  className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-cyan-500/50"
                  onClick={toggleDropdown}
                >
                  <FaUser className="text-lg text-white" />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-14 right-0 bg-white shadow-xl rounded-xl p-2 w-48 border border-gray-100 animate-fadeIn">
                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 rounded-lg transition-all font-medium"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      Update Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 border-2 border-cyan-500 text-cyan-600 rounded-full font-semibold hover:bg-cyan-50 transition-all transform hover:scale-105"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105 shadow-cyan-500/50"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-cyan-600 transition-colors p-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4 animate-fadeIn">
            <nav className="flex flex-col space-y-1">
              <NavLink
                to={user?.id ? "/home" : "/"}
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 font-semibold border-l-4 border-cyan-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/blog"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 font-semibold border-l-4 border-cyan-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/about"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 font-semibold border-l-4 border-cyan-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 font-semibold border-l-4 border-cyan-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Contact
              </NavLink>

              {user?.id && (
                <NavLink
                  to="/like"
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    `px-4 py-3 transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 font-semibold border-l-4 border-pink-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <FaHeart />
                  Liked Blogs
                </NavLink>
              )}
            </nav>

            <div className="mt-4 px-4 space-y-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      toggleMobileMenu();
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 rounded-lg font-semibold hover:shadow-md transition-all"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:shadow-md transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      toggleMobileMenu();
                    }}
                    className="w-full px-4 py-3 border-2 border-cyan-500 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      toggleMobileMenu();
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;