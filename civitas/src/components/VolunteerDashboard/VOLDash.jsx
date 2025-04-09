import React, { useState } from "react";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "../NGODashboard/Discover"; // Component to fetch and display NGOs

const VOLDash = () => {
  const [activeSection, setActiveSection] = useState("discover"); // Default section

  return (
    <div className="flex bg-[#FCF8F1] min-h-screen">
      <VerticalNavbar
        links={[
          { name: "Discover", onClick: () => setActiveSection("discover") },
          { name: "Settings", onClick: () => setActiveSection("settings") },
          { name: "My NGOs", onClick: () => setActiveSection("my-ngos") },
        ]}
      />

      <div className="flex-1 ml-64 p-6">
        {activeSection === "discover" && <Discover />}
        {activeSection === "settings" && <Settings />}
        {activeSection === "my-ngos" && <MyNGOs />}
      </div>
    </div>
  );
};

export default VOLDash;