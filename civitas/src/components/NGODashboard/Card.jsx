import GovtSchool from "../../assets/images/GovtSchool.jpg";
import { useState } from "react";
import AssociationForm from "./AssociationForm";

export default function SchoolCard({
  schoolName = "Govt Primary School Haralur",
  location = "Harlur Road Ambalipura Village Bengaluru 560102",
  schoolId = "2389732",
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow flex flex-col">
      {/* Image Section */}
      <img
        className="w-full h-48 object-cover rounded-t-2xl"
        src={GovtSchool}
        alt={schoolName}
      />

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-extrabold text-gray-900">{schoolName}</h2>
        <p className="text-gray-600 text-sm mt-2 flex-grow">{location}</p>

        <button
          className="mt-6 w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all"
          onClick={() => setIsFormOpen(true)}
        >
          Associate
        </button>
      </div>

      {/* Association Form Modal */}
      <AssociationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schoolName={schoolName}
        schoolId={schoolId}
      />
    </div>
  );
}
