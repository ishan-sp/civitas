import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import DiscoverSchools from "./NGOManageTabs/DiscoverSchools";
import SchoolApplications from "./NGOManageTabs/SchoolApplications";
import MySchools from "./NGOManageTabs/MySchools";

const NGOManagement = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="bg-black text-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">NGO Management</h1>
          <p className="text-lg mt-2 text-blue-100 max-w-3xl">
            Discover schools, track your applications, and manage your current associated schools.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex space-x-6 px-6 py-4">
          <Link
            to="/dashboard/vol/ngomanagement/discover-schools"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive("discover-schools")
                ? "bg-yellow-300 text-black shadow"
                : "bg-gray-100 text-gray-600 hover:bg-yellow-200 hover:text-black"
            }`}
          >
            Discover Schools
          </Link>
          <Link
            to="/dashboard/vol/ngomanagement/school-applications"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive("school-applications")
                ? "bg-yellow-300 text-black shadow"
                : "bg-gray-100 text-gray-600 hover:bg-yellow-200 hover:text-black"
            }`}
          >
            School Applications
          </Link>
          <Link
            to="/dashboard/vol/ngomanagement/my-schools"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive("my-schools")
                ? "bg-yellow-300 text-black shadow"
                : "bg-gray-100 text-gray-600 hover:bg-yellow-200 hover:text-black"
            }`}
          >
            Schools
          </Link>
        </div>
      </div>

      {/* Nested Routes */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="discover-schools" replace />} />
          <Route path="discover-schools" element={<DiscoverSchools />} />
          <Route path="school-applications" element={<SchoolApplications />} />
          <Route path="my-schools" element={<MySchools />} />
        </Routes>
      </div>
    </div>
  );
};

export default NGOManagement;
