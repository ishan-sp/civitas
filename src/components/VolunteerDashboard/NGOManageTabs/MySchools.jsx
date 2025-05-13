import React from "react";
import { useNavigate } from "react-router-dom";

const mySchools = [
  {
    id: 1,
    name: "Riverdale Academy",
    role: "Science Tutor",
    since: "2025-04-01",
    studentsHelped: 120,
  },
];

const MySchools = () => {
  const navigate = useNavigate();

  const handleSchoolClick = (schoolId) => {
    // Get the NGO ID from somewhere, for example from localStorage or passed as a prop
    const ngoId = "AAi2YEpOvzPUiOpAiKacumDcPCK2"; // Placeholder NGO ID
    const url = `/school-management?ngo=${ngoId}&school=${schoolId}`;
    navigate(url);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Current Schools</h2>
      {mySchools.length === 0 ? (
        <p className="text-gray-500">You're not assigned to any school yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {mySchools.map((school) => (
            <div
              key={school.id}
              className="bg-white border border-gray-100 p-5 rounded-xl shadow"
              onClick={() => handleSchoolClick(school.id)} // Add the click handler
            >
              <h3 className="text-xl font-semibold text-blue-900">{school.name}</h3>
              <p className="mt-1 text-gray-700">👨‍🏫 Role: {school.role}</p>
              <p className="text-sm text-gray-500">🗓️ Since: {school.since}</p>
              <p className="text-sm text-gray-500">🎯 Students Helped: {school.studentsHelped}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySchools;
