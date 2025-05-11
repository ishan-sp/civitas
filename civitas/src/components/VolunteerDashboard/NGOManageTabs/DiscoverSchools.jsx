import React from "react";

const sampleSchools = [
  { id: 1, name: "Coastal High School", location: "Mumbai", students: 850 },
  { id: 2, name: "Riverdale Academy", location: "Kolkata", students: 620 },
  { id: 3, name: "Harmony Public School", location: "Delhi", students: 750 },
];

const DiscoverSchools = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-black">Discover Schools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleSchools.map((school) => (
          <div key={school.id} className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
            <h3 className="text-xl font-semibold text-black">{school.name}</h3>
            <p className="text-gray-700 mt-1">📍 {school.location}</p>
            <p className="text-sm text-gray-500 mt-1">{school.students} students enrolled</p>
            <button className="mt-4 bg-yellow-400 text-black text-sm px-4 py-2 rounded hover:bg-yellow-500">
              Apply to Volunteer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverSchools;
