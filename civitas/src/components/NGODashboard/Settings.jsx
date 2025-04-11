import React, { useState, useEffect } from "react";
import ProfileContainer from "./ProfileContainer";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../../firebase"; 

const SettingsSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false); // State to track errors

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoading(true);
        setHasError(false);
        const idToken = await user.getIdToken();
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
        else {
          console.error("Failed to fetch profile data");
          setHasError(true);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
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