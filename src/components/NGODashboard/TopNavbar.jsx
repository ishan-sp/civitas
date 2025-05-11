import React from "react";

const TopNavbar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-10">
      <h1 className="text-xl font-semibold text-gray-800">NGO Dashboard</h1>
      <div className="flex gap-4 items-center">
        {/* Add user icon, notifications, etc., here */}
        <button className="px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition">
          Profile
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
