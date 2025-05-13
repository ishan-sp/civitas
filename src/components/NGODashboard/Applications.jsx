import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import ApplyNGO from "./ApplyNGO";
import ApplySchool from "./ApplySchool";

const Applications = () => {
  const location = useLocation();
  const isSubTabActive = (subPath) =>
    location.pathname === `/dashboard/ngo/volunteers/applications/${subPath}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Sub-tab Navigation */}
      <div className="flex justify-center space-x-8 mb-2">
        <Link
          to="/dashboard/ngo/volunteers/applications/applyngo"
          className={`px-4 py-2 text-sm font-medium rounded-md  ${
            isSubTabActive("applyngo")
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          NGO Applications
        </Link>
        <Link
          to="/dashboard/ngo/volunteers/applications/applyschool"
          className={`px-4 py-2 text-sm font-medium rounded-md  ${
            isSubTabActive("applyschool")
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          School Applications
        </Link>
      </div>

      {/* Nested Sub-Routes */}
      <Routes>
        <Route index element={<Navigate to="applyngo" replace />} />
        <Route path="applyngo" element={<ApplyNGO />} />
        <Route path="applyschool" element={<ApplySchool />} />
      </Routes>
    </div>
  );
};

export default Applications;
