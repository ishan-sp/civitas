import { useState, useEffect, useRef } from "react";
import { FaTh } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { Link } from "react-router-dom";

export default function TopNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-16 bg-white/70 backdrop-blur-lg shadow-md border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 p-2 rounded-xl shadow-inner">
          <SiGoogleclassroom className="text-green-800" size={22} />
        </div>
        <span className="text-xl font-semibold text-gray-800 tracking-tight">
          My Classes
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all">
          <MdAdd size={24} />
        </button>
        <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
          <FaTh size={18} />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-xl bg-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md"
          >
            I
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
