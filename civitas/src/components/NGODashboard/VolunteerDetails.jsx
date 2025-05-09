import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const VolunteerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!details) return <div className="p-6">No data found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate("/dashboard/ngo/volunteers/applications")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Back to Applications
      </button>
      <h2 className="text-2xl font-bold mb-4">{details.fullName}</h2>
      <div className="space-y-2">
        <p><strong>Email:</strong> {details.email}</p>
        <p><strong>Phone Number:</strong> {details.phoneNumber}</p>
        <p><strong>Age:</strong> {details.age}</p>
        <p><strong>USN:</strong> {details.usn}</p>
        <p><strong>Address:</strong> {details.address}</p>
        <p><strong>City:</strong> {details.city}</p>
        <p><strong>Gender:</strong> {details.gender}</p>
        <p><strong>Occupation:</strong> {details.occupation}</p>
        <p><strong>Subjects Comfortable Teaching:</strong> {details.subjects}</p>
        <p><strong>Languages Comfortable With:</strong> {details.languages}</p>
        <p>
          <strong>Resume:</strong>{" "}
          {details.resume ? (
            <a
              href={details.resume}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          ) : (
            "Not uploaded"
          )}
        </p>
      </div>
    </div>
  );
};

export default VolunteerDetails;