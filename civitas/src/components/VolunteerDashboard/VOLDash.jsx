import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import VerticalNavbar from "../VerticalNavbar";
import Discover from "./Discover";
import Settings from "./Settings";
import NGOAssociate from "./NGOAssociate";
import MyNGOs from "./MyNGOs";
import { getAuth } from "firebase/auth";

const VOLDash = () => {
  const [ngos, setNgos] = useState([]); // For Discover NGOs
  const [myNgos, setMyNgos] = useState([]); // For My NGOs
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Fetch NGOs for Discover
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/ngos");
        const data = await res.json();
        console.log("Discover NGOs:", data);
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
    const fetchMyNGOs = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
  
        if (!currentUser) {
          console.warn("User is not logged in.");
          return;
        }
  
        const idToken = await currentUser.getIdToken(true); // Force token refresh
        console.log("ID Token:", idToken);
  
        const res = await fetch("http://localhost:3000/my-ngos", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
  
        console.log("Response Status:", res.status);
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error Response:", errorText);
          throw new Error("Failed to fetch My NGOs");
        }
  
        const data = await res.json();
        console.log("My NGOs:", data);
        setMyNgos(data.result || []);
      } catch (err) {
        console.error("Error fetching My NGOs:", err);
      }
    };
  
    fetchMyNGOs();
  }, []);


  // Handle selected NGO based on URL query parameter
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
                element={<MyNGOs ngos={myNgos} selectedNGO={selectedNGO} />}
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