// ApplyNGO.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const ApplyNGO = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const idToken = await currentUser.getIdToken(true);

      const res = await fetch("https://civitas-rc0z.onrender.com/ngo/getPending", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();
      setApplications(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Applications to Your NGO</h2>
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">No pending applications</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">{app.fullName}</h3>
              <p className="text-gray-600">{app.email}</p>
              <p className="text-gray-600 mt-2">
                <strong>City:</strong> {app.city || "N/A"}
              </p>
              <Link
                to={`/dashboard/ngo/volunteers/applicantdetails/${app.id}`}
                className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg text-center hover:bg-gray-800 transition"
              >
                View Full Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplyNGO;
