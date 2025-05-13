import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import VerticalNavbar from "../VerticalNavbar";
import TopNavbar from "../NGODashboard/TopNavbar";
import Discover from "./Discover";
import Settings from "./Settings";
import NGOAssociate from "./NGOAssociate";
import MyNGOs from "./MyNGOs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NGOManagement from "./NGOManagement";

const VOLDash = () => {
  const [ngos, setNgos] = useState([]);
  const [myNgos, setMyNgos] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Fetch all NGOs
  useEffect(() => {
    let isMounted = true;

    const fetchNGOs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/ngos");
        const data = await res.json();
        if (isMounted) setNgos(data.result || []);
      } catch (err) {
        console.error("Error fetching NGOs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNGOs();
    return () => { isMounted = false; };
  }, []);

  // Fetch My NGOs (auth-aware)
  useEffect(() => {
    let isMounted = true;

    const fetchMyNGOs = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken(true);
            const res = await fetch("http://localhost:3000/my-ngos", {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch My NGOs");
            const data = await res.json();
            if (isMounted) setMyNgos(data.result || []);
          } catch (err) {
            console.error("Error fetching My NGOs:", err);
          }
        }
      });
    };

    fetchMyNGOs();
    return () => { isMounted = false; };
  }, []);

  // Set selected NGO based on query param
  useEffect(() => {
  const id = searchParams.get("ngo");
  console.log('Query param ID:', id); // Log the query param ID
  if (id && ngos.length > 0) {
    const found = ngos.find((ngo) => ngo.id?.toString() === id);
    console.log('Selected NGO:', found); // Log the found NGO
    setSelectedNGO(found || null);
  }
}, [searchParams, ngos]);


  return (
    <div className="flex bg-[#F7F9FC] min-h-screen">
      {/* Sidebar */}
      <VerticalNavbar
        links={[
          { name: "Discover", href: "/dashboard/vol/discover" },
          { name: "My NGOs", href: "/dashboard/vol/myngos" },
          { name: "Settings", href: "/dashboard/vol/settings" },
        ]}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <TopNavbar user_type="Volunteer" />
        <main className="pt-20 px-6">
          {loading ? (
            <div className="text-center text-gray-500 text-lg">Loading NGOs...</div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="discover" replace />} />
              <Route
                path="discover"
                element={
                  <Discover
                    ngos={ngos}
                    setSelectedNGO={(ngo) => setSelectedNGO(ngo)}
                  />
                }
              />
              <Route
                path="myngos"
                element={
                  <MyNGOs
                    ngos={myNgos}
                    setSelectedNGO={setSelectedNGO}
                    selectedNGO={selectedNGO}
                  />
                }
              />
              <Route path="settings" element={<Settings />} />
              <Route path="associate" element={<NGOAssociate ngo={selectedNGO} />} />
              <Route path="ngomanagement/*" element={<NGOManagement />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

export default VOLDash;
