import React, { useState, useEffect } from "react";
import ProfileContainer from "./ProfileContainer";

const SettingsSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false); // State to track errors

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setHasError(false); // Reset error state before fetching
      try {
        const response = await fetch("https://civitas-iota.vercel.app/ngo/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error("Failed to fetch profile data");
          setHasError(true); // Set error state if response is not OK
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setHasError(true); // Set error state on fetch failure
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <section id="settings-section" className="container mx-auto px-6 lg:px-12 pt-20 pb-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Settings</h2>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          <p className="ml-4 text-gray-600">Loading...</p>
        </div>
      ) : hasError ? (
        <h1 className="text-center text-red-600 text-2xl font-bold">Resource not available</h1>
      ) : profileData ? (
        <div className="space-y-4">
          {Object.keys(profileData).map((key) => (
            <ProfileContainer key={key} fieldName={key} fieldValue={profileData[key]} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No data found at the moment</p>
      )}
    </section>
  );
};

export default SettingsSection;