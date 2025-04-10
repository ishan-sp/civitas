import React, { useState } from "react";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "./Discover";
import Settings from "./Settings";
import ngoDashboardHero from "../../assets/images/ngoDashboardHero.jpg";
import NgoHeroSection from "./Hero";

const NGODash = () => {
  const [activeSection, setActiveSection] = useState("discover");

  return (
    <div className="flex bg-[#FCF8F1] min-h-screen">
  {/* Vertical Navbar */}
  <VerticalNavbar
    links={[
      { name: "Discover", onClick: () => setActiveSection("discover") },
      { name: "Settings", onClick: () => setActiveSection("settings") },
    ]}
  />

  {/* Main Content */}
  <div className="flex-1 ml-64">
    {/* ✅ Hero section placed here */}
    <NgoHeroSection
      textPart1="Together We Can"
      textPart2="Make a Difference"
      description="Join us in our mission to help children in need by providing an accessible platform for them to reach you. Get connected with volunteers and expand your presence."
      imageLink={ngoDashboardHero}
    />

    {/* Actual Section */}
    <div className="p-6">
      {activeSection === "discover" && <Discover />}
      {activeSection === "settings" && <Settings />}
    </div>
  </div>
</div>

  );
};

export default NGODash;
