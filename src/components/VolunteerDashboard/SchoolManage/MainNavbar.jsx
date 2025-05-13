import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";

function MainNavbar({ links = [] }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-md z-20`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        {/* Use the same icon as before, FaUniversity */}
        <RouterLink
          to="/"
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 flex items-center justify-center"
        >
          {collapsed ? (
            <FaUniversity className="text-3xl" />
          ) : (
            "Civitas"
          )}
        </RouterLink>
      </div>

      {/* Links Section */}
      <nav className="flex flex-col items-start p-4 space-y-4">
        {links.map((link, index) => (
          <RouterLink
            key={index}
            to={link.href}
            className={`w-full flex items-center px-4 py-2 text-base text-gray-800 transition-all duration-200 rounded-lg hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black ${
              collapsed ? "justify-center" : "justify-start"
            }`}
          >
            <div className="text-xl">{link.icon || <FaHome />}</div>
            <span className={`${collapsed ? "hidden" : ""} ml-4`}>{link.name}</span>
          </RouterLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => alert("Logout")}
          className="w-full flex items-center px-4 py-2 text-base text-red-600 transition-all duration-200 rounded-lg hover:bg-red-300 hover:text-black focus:bg-red-300 focus:text-black justify-center"
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`${collapsed ? "hidden" : ""} ml-4`}>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default MainNavbar;
