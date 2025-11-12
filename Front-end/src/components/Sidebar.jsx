import React from "react";

import { FaUser } from "react-icons/fa";
import { MdDashboard, } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { LuNotebook } from "react-icons/lu";
import { useNavigate } from "react-router";



const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Sidebar Container */}
      <div className="fixed w-65 h-full bg-slate-900 shadow-2xl overflow-y-auto z-50">
        {/* Header */}
        <div className="p-6 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-orange-500 hover:to-pink-600 transition-all duration-500 cursor-pointer group">
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
              <h1 name="person-circle-outline" className="text-2xl text-black">
                <FaUser />
              </h1>
            </div>
            <h2 className="text-white font-bold text-xl">Admin Panel</h2>
            <p className="text-blue-200 text-sm">Blog Management</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="px-4 space-y-2">
          {/* Dashboard */}
          <div className="group cursor-pointer">
            <div className=" w-full flex items-center space-x-4 px-4 py-3 rounded-xl bg-gradient-to-r bg-blue-600 hover:bg-white text-white font-semibold  rounded-xl hover:translate-x-2 transition-all duration-300 relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <MdDashboard className="text-xl text-black" />
              </div>
              <span className="text-white font-semibold group-hover:text-orange-500 transition-colors duration-300  group-hover:scale-110 transition-all duration-300">
                Dashboard
              </span>
            </div>
          </div>
            {/* Total Blogs */}
          <div className="group cursor-pointer">
            <div
            onClick={()=>navigate("/allBlogs")}  
            className="w-full px-4 py-3 flex items-center space-x-4 rounded-xl bg-gradient-to-r bg-blue-600 hover:bg-white text-white hover:translate-x-2 transition-all duration-300 relative ">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center  group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <PiStudentBold className="text-xl text-black" />
              </div>
              <span
               className="text-white font-semibold group-hover:text-orange-500">
                Total Blogs
              </span>
            </div>
          </div>

          {/* Add Blogs */}
          <div className="group cursor-pointer">
            <div
            onClick={() => navigate("/addBlog")} 
            className="w-full px-4 py-3 flex items-center space-x-4 rounded-xl bg-gradient-to-r bg-blue-600 hover:bg-white text-white hover:translate-x-2 transition-all duration-300 relative ">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center  group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <FaRegUser  className="text-xl text-black" />
              </div>
              <span className="text-white font-semibold group-hover:text-orange-500">
                Add Blogs
              </span>
            </div>
          </div>
          {/* like Blogs */}
          <div className="group cursor-pointer">
            <div 
            onClick={()=> navigate("/addCatagory")} 
            className="w-full px-4 py-3 flex items-center space-x-4 rounded-xl bg-gradient-to-r bg-blue-600 hover:bg-white text-white hover:translate-x-2 transition-all duration-300 relative ">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center  group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <LuNotebook className="text-xl text-black" />
              </div>
              <span className="text-white font-semibold group-hover:text-orange-500">
               Catagories  
              </span>
            </div>
          </div>
          {/* unpublished Blogs */}
           <div className="group cursor-pointer">
            <div
            onClick={() => navigate("")} 
            className="w-full px-4 py-3 flex items-center space-x-4 rounded-xl bg-gradient-to-r bg-blue-600 hover:bg-white text-white hover:translate-x-2 transition-all duration-300 relative ">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center  group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <FaRegUser  className="text-xl text-black" />
              </div>
              <span className="text-white font-semibold group-hover:text-orange-500">
                Unpublished Blogs
              </span>
            </div>
          </div>
          {/* Likes Bogs */}
          <div className="group cursor-pointer">
            <div 
            onClick={()=> navigate("")} 
            className="w-full px-4 py-3 flex items-center space-x-4 rounded-xl bg-gradient-to-r bg-blue-600 hover:bg-white text-white hover:translate-x-2 transition-all duration-300 relative ">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center  group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <LuNotebook className="text-xl text-black" />
              </div>
              <span className="text-white font-semibold group-hover:text-orange-500">
               Likes Blogs 
              </span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
