import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/auth/authSlice.js";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    dispatch(logout()); // ✅ updates Redux state properly
    navigate("/"); // optional redirect
  };

  return (
    <header className="py-2 fixed w-full bg-b dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo section */}
        <div className="flex gap-7 items-center">
          <div className="flex gap-2 items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-7 h-7 md:w-10 md:h-10 dark:invert"
            />
            <h1 className="font-bold text-3xl md:text-4xl">Logo</h1>
          </div>
        </div>

        {/* navigation links */}
        <nav className="space-x-5 md:space-x-10 font-medium text-lg md:text-xl">
          <NavLink to={"/"} className="text-gray-600 hover:text-gray-800">
            Home
          </NavLink>
          <NavLink to={"/blog"} className="text-gray-600 hover:text-gray-800">
            Blog
          </NavLink>
          <NavLink to={"/about"} className="text-gray-600 hover:text-gray-800">
            About
          </NavLink>
          <NavLink
            to={"/contact"}
            className="text-gray-600 hover:text-gray-800"
          >
            Contact
          </NavLink>
        </nav>

        {/* action buttons */}
        <div className="space-x-3">
          {isAuthenticated ? (
            <div className="relative p-1 cursor-pointer flex justify-center items-center gap-3">
              {/* Profile icon */}
              <div
                className="w-11 h-11 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 transition-transform duration-300 hover:scale-110"
                onClick={toggleDropdown}
              >
                <h1 className="text-2xl text-black">
                  <FaUser />
                </h1>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-14 right-0 bg-white shadow-lg rounded-md p-3 w-40">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    onClick={() => navigate("/profile")}
                  >
                    Update Profile
                  </button>
                </div>
              )}
              <Button
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
