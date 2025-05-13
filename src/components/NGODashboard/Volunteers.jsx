import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Applications from "./Applications";
import CurrentVolunteers from "./CurrentVolunteers";

const Volunteers = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="bg-[#F7F9FC] min-h-screen">
      {/* Header Section */}
      <div className="bg-black text-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Volunteer Management</h1>
          <p className="text-lg mt-2 text-blue-100 max-w-3xl">
            Track applications and coordinate with your current volunteers efficiently from one place.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex space-x-6 px-6 py-4">
          <Link
            to="/dashboard/ngo/volunteers/applications"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive("applications")
                ? "bg-yellow-300 text-black shadow"
                : "bg-gray-100 text-gray-600 hover:bg-yellow-200 hover:text-black"
            }`}
          >
            Applications
          </Link>
          <Link
            to="/dashboard/ngo/volunteers/current-volunteers"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive("current-volunteers")
                ? "bg-yellow-300 text-black shadow"
                : "bg-gray-100 text-gray-600 hover:bg-yellow-200 hover:text-black"
            }`}
          >
            Current Volunteers
          </Link>
        </div>
      </div>

      {/* Nested Routes */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="applications" replace />} />
          <Route path="applications/*" element={<Applications />} />
          <Route path="current-volunteers" element={<CurrentVolunteers />} />
        </Routes>
      </div>
    </div>
  );
};

export default Volunteers;
