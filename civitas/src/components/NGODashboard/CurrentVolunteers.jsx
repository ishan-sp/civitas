import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const CurrentVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      // Get the currently authenticated user
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.warn("User is not logged in.");
        return;
      }

      // Retrieve the ID token
      const idToken = await currentUser.getIdToken(true); // Force token refresh
      console.log("ID Token:", idToken);

      // Fetch current volunteers
      const res = await fetch("http://localhost:3000/ngo/my-volunteers", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      console.log("Response Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error Response:", errorText);
        throw new Error("Failed to fetch current volunteers");
      }

      const data = await res.json();
      console.log("Fetched Volunteers:", data);

      // Check if data.result is an array
      if (Array.isArray(data.result)) {
        setVolunteers(data.result);
      } else {
        console.warn("Unexpected response format:", data.result);
        setVolunteers([]); // Set to an empty array if result is not an array
      }
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Current Volunteers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : volunteers.length === 0 ? (
        <p>No current volunteers</p>
      ) : (
        <div className="space-y-4">
          {volunteers.map((volunteer, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                {volunteer.fullName || "Unknown Volunteer"}
              </h3>
              <p>{volunteer.email || "No email provided"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentVolunteers;