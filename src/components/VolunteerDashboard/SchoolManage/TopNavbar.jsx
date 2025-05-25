import React from "react";

const TopNavbar = ({ user_type, collapsed }) => {
  const leftOffset = collapsed ? "5rem" : "16rem"; // Matches sidebar width

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-10 transition-all duration-300 ease-in-out"
      style={{
        left: leftOffset,
      }}
    >
      <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
        {/* Add some margin or padding here if you want spacing */}
        <h1 className="text-xl font-semibold text-gray-800">
          {user_type} Dashboard
        </h1>
      </div>
      <div className="flex gap-4 items-center">
        <button className="px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition">
          Profile
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
