import React, { useState } from "react";
import logo from "../assets/logo.svg";
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
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Call parent component's search function
    if (onSearch) {
      onSearch(query);
    }
  };

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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(user?.id ? "/home" : "/")}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 lg:w-10 lg:h-10 transition-transform hover:scale-110"
            />
            <h1 className="font-bold text-2xl lg:text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Logo
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-base">
            <NavLink
              to={user?.id ? "/home" : "/"}
              className="transition-all hover:text-cyan-600"
            >
              Home
            </NavLink>

            <NavLink to="/blog" className="transition-all hover:text-cyan-600">
              Blog
            </NavLink>

            <NavLink to="/about" className="transition-all hover:text-cyan-600">
              About
            </NavLink>

            <NavLink to="/contact" className="transition-all hover:text-cyan-600">
              Contact
            </NavLink>

            {/* ⭐ SIMPLE ALWAYS-VISIBLE SEARCH FIELD */}
            <form onSubmit={handleSearchChange } className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1.5 border rounded-md outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>

            {user?.id && (
              <NavLink
                to="/like"
                className="flex items-center gap-2 hover:text-pink-600 transition-all"
              >
                <FaHeart /> Liked Blogs
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <div
                  className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <FaUser className="text-lg text-white" />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-14 right-0 bg-white shadow-xl rounded-xl p-2 w-48 border border-gray-100">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      Update Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
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
                  className="px-6 py-2.5 border-2 border-cyan-500 text-cyan-600 rounded-full"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 p-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-1">
              <NavLink to={user?.id ? "/home" : "/"} onClick={toggleMobileMenu} className="px-4 py-3">
                Home
              </NavLink>

              <NavLink to="/blog" onClick={toggleMobileMenu} className="px-4 py-3">
                Blog
              </NavLink>

              <NavLink to="/about" onClick={toggleMobileMenu} className="px-4 py-3">
                About
              </NavLink>

              <NavLink to="/contact" onClick={toggleMobileMenu} className="px-4 py-3">
                Contact
              </NavLink>

              {user?.id && (
                <NavLink to="/like" onClick={toggleMobileMenu} className="px-4 py-3 flex items-center gap-2">
                  <FaHeart /> Liked Blogs
                </NavLink>
              )}
            </nav>

            {/* Mobile Search */}
            <div className="px-4 mt-3">
              <form onSubmit={handleSearchChange} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Mobile Auth */}
            <div className="mt-4 px-4 space-y-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      toggleMobileMenu();
                    }}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                  >
                    Update Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg"
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
                    className="w-full px-4 py-3 border-2 border-cyan-500 text-cyan-600 rounded-lg"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      navigate("/signup");
                      toggleMobileMenu();
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg"
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
