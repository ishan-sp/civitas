import React from "react";
import Card from "./Card";
import SearchBar from "../NGODashboard/Searchbar";
import { useNavigate } from "react-router-dom";

const Discover = ({ ngos, setSelectedNGO }) => {
  const [filteredNgos, setFilteredNgos] = React.useState(ngos);
  const navigate = useNavigate();

  React.useEffect(() => {
    setFilteredNgos(ngos);
  }, [ngos]);

  const handleCardClick = (ngo) => {
    setSelectedNGO(ngo);
    navigate(`?name=${encodeURIComponent(ngo.name)}`);
  };

  return (
    <>
      <SearchBar
        data={ngos}
        filterKey="name"
        onResults={(results) => setFilteredNgos(results)}
      />

      <section className="container mx-auto px-6 lg:px-12 pt-10 pb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          NGOs You Can Volunteer With
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNgos.map((ngo, index) => (
            <div key={index} onClick={() => handleCardClick(ngo)} className="cursor-pointer">
              <Card
                name={ngo.ngoName}
                location={ngo.location}
                id={ngo.id}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Discover;
