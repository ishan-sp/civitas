import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../../../firebase";

const DiscoverSchools = () => {
  const [searchParams] = useSearchParams();
  const ngoId = searchParams.get("ngo");

  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [joiningStatus, setJoiningStatus] = useState({}); // track joining status per school

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const user = auth.currentUser;
        if (user && ngoId) {
          const idToken = await user.getIdToken();

          const response = await fetch("http://localhost:3000/get-schools", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ ngoId }),
          });

          if (response.ok) {
            const data = await response.json();
            setSchools(data.result);
          } else {
            setHasError(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, [ngoId]);

  const handleApply = async (schoolId) => {
    setJoiningStatus((prev) => ({ ...prev, [schoolId]: "loading" }));

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:3000/join-school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ schoolId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Applied successfully!");
        setJoiningStatus((prev) => ({ ...prev, [schoolId]: "applied" }));
      } else {
        alert(data.message || "Failed to apply.");
        setJoiningStatus((prev) => ({ ...prev, [schoolId]: "error" }));
      }
    } catch (err) {
      console.error("Error joining school:", err);
      alert("Something went wrong while applying.");
      setJoiningStatus((prev) => ({ ...prev, [schoolId]: "error" }));
    }
  };

  if (isLoading) return <p>Loading schools...</p>;
  if (hasError) return <p>Error loading schools.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-black">Discover Schools</h2>
      {schools.length === 0 ? (
        <p className="text-gray-600">No schools available to apply for this NGO.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div key={school.id} className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
              <h3 className="text-xl font-semibold text-black">{school.name}</h3>
              <p className="text-gray-700 mt-1">📍 {school.location}</p>
              <p className="text-sm text-gray-500 mt-1">{school.students} students enrolled</p>

              <button
                className="mt-4 bg-yellow-400 text-black text-sm px-4 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
                onClick={() => handleApply(school.id)}
                disabled={joiningStatus[school.id] === "loading" || joiningStatus[school.id] === "applied"}
              >
                {joiningStatus[school.id] === "loading"
                  ? "Applying..."
                  : joiningStatus[school.id] === "applied"
                  ? "Applied"
                  : "Apply to Volunteer"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverSchools;
