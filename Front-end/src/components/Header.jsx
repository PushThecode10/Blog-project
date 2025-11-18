import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Call parent component's search function
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="ml-62 bg-blue-400 shadow px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Menu Icon */}
        <div className="text-[25px] cursor-pointer">
          <IoMenu />
        </div>

        {/* Search Input */}
        <div className="w-full max-w-md mx-4">
          <input
            type="text"
            placeholder="Search blog by title or category"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Profile Icon */}
        <div className="p-1 cursor-pointer relative">
          <div
            className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={toggleDropdown}
          >
            <FaUser className="text-2xl text-black" />
          </div>

          {isDropdownOpen && (
            <div className="absolute bg-white shadow-lg rounded-lg w-40 mt-2 right-0 p-2 z-50">
              <ul className="space-y-2 cursor-pointer">
                <li>
                  <Link className="w-full text-left text-black block px-2 py-1 hover:bg-gray-100 rounded" to="/logout">
                    Logout
                  </Link>
                </li>
                <li>
                  <button className="w-full text-left text-black px-2 py-1 hover:bg-gray-100 rounded">
                    Profile
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;