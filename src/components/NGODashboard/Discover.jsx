import React, { useState } from "react";
import SearchBar from "./Searchbar";
import SchoolCard from "./Card";
import NgoHeroSection from "./Hero";
import ngoDashboardHero from "../../assets/images/ngoDashboardHero.jpg";

const Discover = () => {
  const schools = [
    { schoolName: "Govt Primary School Haralur", location: "Harlur Road Ambalipura Village Bengaluru 560102", schoolId: "2389732" },
    { schoolName: "Govt High School Koramangala", location: "Koramangala 6th Block, Bengaluru 560095", schoolId: "2389733" },
    { schoolName: "Govt Primary School Whitefield", location: "Whitefield Main Road, Bengaluru 560066", schoolId: "2389734" },
    { schoolName: "Govt Senior Secondary School Jaipur", location: "MI Road, Jaipur, Rajasthan 302001", schoolId: "2389735" },
    { schoolName: "Govt High School Ranchi", location: "Main Road, Ranchi, Jharkhand 834001", schoolId: "2389736" },
    { schoolName: "Govt Primary School Andheri", location: "Andheri West, Mumbai, Maharashtra 400058", schoolId: "2389737" },
  ];

  const [filteredSchools, setFilteredSchools] = useState(schools);

  return (
    <>
      {/* Hero Section */}
      <NgoHeroSection
        textPart1="Together We Can"
        textPart2="Make a Difference"
        description="Join us in our mission to help children in need by providing an accessible platform for them to reach you. Get connected with volunteers and expand your presence."
        imageLink={ngoDashboardHero}
      />

      {/* Discover Section */}
      <section id="discover-section" className="container mx-auto px-6 lg:px-12 pt-20 pb-4">
        <SearchBar
          data={schools}
          filterKey={["schoolName", "location"]}
          onResults={(results) => {
            const filtered = schools.filter((school) =>
              results.some((query) =>
                school.schoolName.toLowerCase().includes(query.toLowerCase()) ||
                school.location.toLowerCase().includes(query.toLowerCase())
              )
            );
            setFilteredSchools(filtered);
          }}
        />
        <section id="associate-section" className="container mx-auto px-6 lg:px-12 py-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Schools You Can Associate With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map((school, index) => (
              <SchoolCard
                key={index}
                schoolName={school.schoolName}
                location={school.location}
                schoolId={school.schoolId}
              />
            ))}
          </div>
        </section>
      </section>
    </>
  );
};

export default Discover;