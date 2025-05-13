import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaBell, FaCog, FaUserCircle } from "react-icons/fa";

function TopNavbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-30">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        {/* Left section: Logo */}
        <RouterLink
          to="/"
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800"
        >
          Civitas
        </RouterLink>

        {/* Right section: Icons and user info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <FaHome className="text-xl text-gray-800 hover:text-black cursor-pointer" />
            <FaBell className="text-xl text-gray-800 hover:text-black cursor-pointer" />
            <FaCog className="text-xl text-gray-800 hover:text-black cursor-pointer" />
          </div>
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl text-gray-800 hover:text-black cursor-pointer" />
            <span className="text-sm text-gray-800">User</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
