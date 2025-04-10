import React, { useState } from "react";
import SchoolCard from "../NGODashboard/Card";

const Discover = () => {
  const ngos = [
    { ngoName: "Helping Hands Foundation", location: "Bengaluru, Karnataka", ngoId: "ngo1" },
    { ngoName: "Care for All", location: "Mumbai, Maharashtra", ngoId: "ngo2" },
    { ngoName: "Bright Futures", location: "Delhi, India", ngoId: "ngo3" },
    { ngoName: "Green Earth Initiative", location: "Chennai, Tamil Nadu", ngoId: "ngo4" },
    { ngoName: "Hope and Smile", location: "Kolkata, West Bengal", ngoId: "ngo5" },
    { ngoName: "Education for All", location: "Hyderabad, Telangana", ngoId: "ngo6" },
  ];

  const [filteredNgos, setFilteredNgos] = useState(ngos);

  return (
    <>
      <section id="discover-section" className="container mx-auto px-6 lg:px-12 pt-20 pb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          NGOs You Can Volunteer With
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNgos.map((ngo, index) => (
            <SchoolCard
              key={index}
              schoolName={ngo.ngoName} // Display NGO name
              location={ngo.location} // Display location as description
              schoolId={ngo.ngoId} // Use ngoId for unique identification
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Discover;