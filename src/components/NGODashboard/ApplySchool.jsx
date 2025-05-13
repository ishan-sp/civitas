import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const ApplySchool = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchoolApplications = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const idToken = await currentUser.getIdToken(true);

      const res = await fetch("http://localhost:3000/get-volunteer-school-requests", {
        method:"POST",
        headers: { 
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json"
        },
      });

      const data = await res.json();
      setApplications(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      console.error("Error fetching school applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolApplications();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Applications to Your Affiliated Schools</h2>
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">No pending school applications</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => {
            const name = Object.keys(app)[0];
            const schools = app[name];
            return (
              <div key={index} className="border border-gray-200 p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  {schools.map((school, idx) => (
                    <li key={idx}>{school}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplySchool;
