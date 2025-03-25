import React, { useState } from "react";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "./Discover";
import Settings from "./Settings";

const NGODash = () => {
  const [activeSection, setActiveSection] = useState("discover"); // Default to "discover"

  return (
    <div className="flex bg-[#FCF8F1] min-h-screen">
      {/* Vertical Navbar */}
      <VerticalNavbar
        links={[
          { name: "Discover", href: "#", onClick: () => setActiveSection("discover") },
          { name: "Settings", href: "/ngo/settings", onClick: () => setActiveSection("settings") },
        ]}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {activeSection === "discover" && <Discover />}
        {activeSection === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default NGODash;