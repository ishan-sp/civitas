import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "./Discover";
import Settings from "./Settings";
import NGOAssociate from "./NGOAssociate";
import MyNGOs from "./MyNGOs";

const VOLDash = () => {
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

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && ngos.length > 0) {
      const foundNGO = ngos.find((ngo) => ngo.id.toString() === id); // toString to avoid type mismatch
      setSelectedNGO(foundNGO || null);
    }
  }, [searchParams, ngos]);
  

  return (
    <div className="flex bg-[#FCF8F1] min-h-screen">
      {/* Sidebar */}
      <VerticalNavbar
        links={[
          { name: "Discover", href: "/dashboard/vol/discover" },
          { name: "Settings", href: "/dashboard/vol/settings" },
          { name: "My NGOs", href: "/dashboard/vol/myngos" },
        ]}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-600 text-xl">Loading NGOs...</div>
          ) : (
            <Routes>
              {/* Default Route: Redirect to Discover */}
              <Route path="/" element={<Navigate to="discover" replace />} />

              {/* Discover Route */}
              <Route
                path="discover"
                element={
                  <Discover ngos={ngos} setSelectedNGO={(ngo) => setSelectedNGO(ngo)} />
                }
              />

              {/* Settings Route */}
              <Route path="settings" element={<Settings />} />

              {/* My NGOs Route */}
              <Route
                path="myngos"
                element={<MyNGOs ngos={ngos} selectedNGO={selectedNGO} />}
              />

              {/* NGO Associate Route */}
              <Route
                path="associate"
                element={<NGOAssociate ngo={selectedNGO} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default VOLDash;