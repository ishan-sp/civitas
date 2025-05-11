import React from "react";
import Card from "./Card";
import SearchBar from "../NGODashboard/Searchbar";
import NgoHeroSection from "../NGODashboard/Hero";
import ngoDashboardHero from "../../assets/images/volDashboardHero.jpg";

const MyNGOs = ({ ngos, setSelectedNGO }) => {
  const [filteredNgos, setFilteredNgos] = React.useState(ngos);

  React.useEffect(() => {
    setFilteredNgos(ngos);
  }, [ngos]);

  return (
    <>
      <NgoHeroSection
        textPart1="Be the Change"
        textPart2="You Wish to See"
        description="Empower communities by volunteering your time and skills. Connect with NGOs and make a lasting impact on the lives of those in need."
        imageLink={ngoDashboardHero}
      />
      <SearchBar
        data={ngos}
        filterKey="name"
        onResults={(results) => setFilteredNgos(results)}
      />
      <section className="container mx-auto px-6 lg:px-12 pt-10 pb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          My NGOS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNgos.map((ngo, index) => (
            <Card
              key={index}
              ngo={ngo}
              link={`/dashboard/vol/ngomanagement?ngo=${ngo.id}`} // Custom link to view NGO
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default MyNGOs;
