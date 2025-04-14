import React, { useState, useEffect } from "react";
import ProfileContainer from "./ProfileContainer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const SettingsSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  const fetchProfileData = async (user) => {
    try {
      setIsLoading(true);
      setError(null);
      
   
      const idToken = await user.getIdToken(true); 
      
      const response = await fetch("http://localhost:3000/user-profile", { 
        method: "GET",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfileData(user);
      } else {
        setError("No authenticated user");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchProfileData(user);
    }
  };

  return (
    <section id="settings-section" className="container mx-auto px-6 lg:px-12 pt-20 pb-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Settings</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          <p className="ml-4 text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <h1 className="text-red-600 text-2xl font-bold mb-4">{error}</h1>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : profileData ? (
        <div className="space-y-4">
            <ProfileContainer 
              profileData={profileData}
            />
        </div>
      ) : (
        <p className="text-center text-gray-600">No profile data available</p>
      )}
    </section>
  );
};

export default SettingsSection;