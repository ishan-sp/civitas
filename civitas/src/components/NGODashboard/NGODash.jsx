import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VerticalNavbar from "../VerticalNavbar";
import TopNavbar from "./TopNavbar";
import Discover from "./Discover";
import Settings from "./Settings";
import Volunteers from "./Volunteers";
import VolunteerDetails from "./VolunteerDetails";

const NGODash = () => {
  return (
    <div className="flex bg-[#F7F9FC] min-h-screen">
      <VerticalNavbar
        links={[
          { name: "Discover", href: "/dashboard/ngo/discover" },
          { name: "Volunteers", href: "/dashboard/ngo/volunteers" },
          { name: "Settings", href: "/dashboard/ngo/settings" },
        ]}
      />

      <div className="flex-1 ml-64">
        <TopNavbar />
        <main className="pt-20 px-6">
          <Routes>
            <Route path="/" element={<Navigate to="discover" replace />} />
            <Route path="discover" element={<Discover />} />
            <Route path="volunteers/*" element={<Volunteers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="volunteers/details/:id" element={<VolunteerDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default NGODash;
