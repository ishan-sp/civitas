import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken(true);
      const res = await fetch("http://localhost:3000/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }), // Pass the volunteer ID as a filter
      });

      if (!res.ok) {
        throw new Error("Failed to fetch volunteer details");
      }

      const data = await res.json();
      if (Array.isArray(data.result) && data.result.length > 0) {
        setDetails(data.result[0]); // Assuming the first result is the correct one
      } else {
        setDetails(null);
      }
    } catch (err) {
      console.error("Failed to fetch volunteer details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken(true);
      const res = await fetch("http://localhost:3000/ngo/approveVolunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ volId: id }),
      });

      if (!res.ok) {
        throw new Error("Failed to approve volunteer");
      }

      alert("Volunteer approved successfully!");
      navigate("/dashboard/ngo/volunteers/applications");
    } catch (err) {
      console.error("Error approving volunteer:", err);
      alert("An error occurred while approving the volunteer.");
    }
  };

  const handleReject = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken(true);
      const res = await fetch("http://localhost:3000/ngo/rejectVolunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ volId: id }),
      });

      if (!res.ok) {
        throw new Error("Failed to reject volunteer");
      }

      alert("Volunteer rejected successfully!");
      navigate("/dashboard/ngo/volunteers/applications");
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
      alert("An error occurred while rejecting the volunteer.");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-700">Loading...</div>;
  if (!details) return <div className="p-6 text-center text-gray-700">No data found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-[#f9f9f9] text-gray-900 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">{details.fullName}</h2>
        <button
          onClick={() => navigate("/dashboard/ngo/volunteers/applications")}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 transition"
        >
          Return
        </button>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {[
          ["Email", details.email],
          ["Phone Number", details.phone],
          ["Age", details.age],
          ["USN", details.usn],
          ["Address", details.address],
          ["City", details.city],
          ["Gender", details.gender],
          ["Occupation", details.occupation],
          ["Subjects Comfortable Teaching", details.subject],
          ["Languages Comfortable With", details.languages],
        ].map(([label, value], i) => (
          <div
            key={i}
            className="p-4 bg-white border border-gray-200 rounded-md shadow-sm"
          >
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{label}</p>
            <p className="text-gray-800">{value || "—"}</p>
          </div>
        ))}
  
        <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm col-span-full">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Resume</p>
          {details.resume ? (
            <a
              href={details.resume}
              className="text-blue-600 underline hover:text-blue-800 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          ) : (
            <p className="text-gray-800">Not uploaded</p>
          )}
        </div>
      </div>
  
      <div className="mt-10 flex justify-end gap-4">
        <button
          onClick={handleApprove}
          className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition"
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
  
};  
export default ApplicantDetails;