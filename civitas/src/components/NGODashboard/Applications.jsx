import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const idToken = await currentUser.getIdToken(true);

      const res = await fetch("http://localhost:3000/ngo/getPending", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();
      if (Array.isArray(data.result)) {
        setApplications(data.result);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (volId) => {
    try {
      const idToken = await getAuth().currentUser.getIdToken(true);
      const res = await fetch("http://localhost:3000/ngo/approveVolunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ volId }),
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error("Error approving volunteer:", err);
    }
  };

  const handleReject = async (volId) => {
    try {
      const idToken = await getAuth().currentUser.getIdToken(true);
      const res = await fetch("http://localhost:3000/ngo/rejectVolunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ volId }),
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[75vh]">
      <h2 className="text-2xl font-bold mb-4">Pending Applications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No pending applications</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold">{app.fullName || "Unknown Volunteer"}</h3>
              <p className="text-gray-600">{app.email}</p>
              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
              <Link
                to={`/dashboard/ngo/volunteers/details/${app.id}`}
                className="block mt-4 text-blue-600 underline text-sm"
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

export default Applications;
