import React, { useState } from "react";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "./Discover";
import NgoHeroSection from "../NGODashboard/Hero";
import ngoDashboardHero from "../../assets/images/volDashboardHero.jpg";

const VOLDash = () => {
  const [activeSection, setActiveSection] = useState("discover"); // Default section

  return (
    <div className="flex bg-[#FCF8F1] min-h-screen">
  {/* Vertical Navbar */}
  <VerticalNavbar
    links={[
      { name: "Discover", onClick: () => setActiveSection("discover") },
      { name: "Settings", onClick: () => setActiveSection("settings") },
      { name: "My NGOs", onClick: () => setActiveSection("settings") },
    ]}
  />

  {/* Main Content */}
  <div className="flex-1 ml-64">
    {/* ✅ Hero section placed here */}
    <NgoHeroSection
  textPart1="Be the Change"
  textPart2="You Wish to See"
  description="Empower communities by volunteering your time and skills. Connect with NGOs and make a lasting impact on the lives of those in need."
  imageLink={ngoDashboardHero}
/>

    {/* Actual Section */}
    <div className="p-6">
      {activeSection === "discover" && <Discover />}
      {activeSection === "settings" && <Settings />}
      {activeSection === "settings" && <MyNGOs />}
    </div>
  </div>
</div>

  );
};

export default VOLDash;



