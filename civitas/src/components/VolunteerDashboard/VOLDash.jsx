import React, { useState, useEffect } from "react";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "./Discover";
import NgoHeroSection from "../NGODashboard/Hero";
import NGOAssociate from "./NGOAssociate";
import ngoDashboardHero from "../../assets/images/volDashboardHero.jpg";
import { useSearchParams } from "react-router-dom";

const VOLDash = () => {
  const [activeSection, setActiveSection] = useState("discover");
  const [ngos, setNgos] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Fetch NGO data from API
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/ngos");
        const data = await res.json();
        setNgos(data.result || []);
      } catch (err) {
        console.error("Error fetching NGOs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  // Auto-open NGO associate view from search param
  useEffect(() => {
    const name = searchParams.get("name");
    if (name && ngos.length > 0) {
      const found = ngos.find((ngo) =>
        ngo.ngoName?.toLowerCase().includes(name.toLowerCase())
      );
      if (found) {
        setSelectedNGO(found);
        setActiveSection("associate");
      }
    }
  }, [searchParams, ngos]);

  return (
    <div className="flex bg-[#FCF8F1] min-h-screen">
      <VerticalNavbar
        links={[
          { name: "Discover", onClick: () => setActiveSection("discover") },
          { name: "Settings", onClick: () => setActiveSection("settings") },
          { name: "My NGOs", onClick: () => setActiveSection("settings") },
        ]}
      />

      <div className="flex-1 ml-64">
        <NgoHeroSection
          textPart1="Be the Change"
          textPart2="You Wish to See"
          description="Empower communities by volunteering your time and skills. Connect with NGOs and make a lasting impact on the lives of those in need."
          imageLink={ngoDashboardHero}
        />

        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-600 text-xl">Loading NGOs...</div>
          ) : activeSection === "discover" ? (
            <Discover
              ngos={ngos}
              setSelectedNGO={(ngo) => {
                setSelectedNGO(ngo);
                setActiveSection("associate");
              }}
            />
          ) : activeSection === "associate" && selectedNGO ? (
            <NGOAssociate ngo={selectedNGO} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VOLDash;
