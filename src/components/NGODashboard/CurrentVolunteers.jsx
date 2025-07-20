import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const CurrentVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const idToken = await currentUser.getIdToken(true);
      const res = await fetch("https://civitas-rc0z.onrender.com/ngo/my-volunteers", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();
      if (Array.isArray(data.result)) {
        setVolunteers(data.result);
      } else {
        setVolunteers([]);
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
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[75vh]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Current Volunteers</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : volunteers.length === 0 ? (
        <p className="text-gray-600">No current volunteers</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer._id}
              className="border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {volunteer.fullName || "Unknown Volunteer"}
              </h3>
              <p className="text-gray-600">{volunteer.email || "No email provided"}</p>
              <p className="text-gray-600 mt-2">
                <strong>City:</strong> {volunteer.city || "N/A"}
              </p>
              <button
                onClick={() => navigate(`/dashboard/ngo/volunteers/volunteerdetails/${volunteer._id}`)}
                className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg text-center hover:bg-gray-800 transition"
              >
                View Full Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentVolunteers;
