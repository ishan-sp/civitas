import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

const statusColor = {
  Pending: "text-yellow-500",
  Accepted: "text-green-600",
  Rejected: "text-red-500",
};

const SchoolApplications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoading(true);
        setHasError(false);
        try {
          const idToken = await user.getIdToken();
          const response = await fetch("http://localhost:3000/get-school-applications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setApplications(data.result || []);
          } else {
            console.error("Failed to fetch school applications");
            setHasError(true);
          }
        } catch (error) {
          console.error("Error fetching applications:", error);
          setHasError(true);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your School Applications</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : hasError ? (
        <p className="text-red-500">Error loading applications.</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="px-6 py-3">School</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.schoolId} className="border-t">
                  <td className="px-6 py-4 font-medium">{app.schoolName}</td>
                  <td className={`px-6 py-4 font-semibold ${statusColor[app.status]}`}>{app.status}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {app.appliedOn? new Date(app.appliedOn._seconds * 1000).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SchoolApplications;
