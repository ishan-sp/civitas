import React, { useEffect, useState } from "react";
import RegistrationForm from "../components/Registration";

const VolunteerRegistration = () => {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [showResume, setShowResume] = useState(false); // For viewing resume

  const fetchSuggestions = async (input, type) => {
    if (!input) return [];
    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${type}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      if (data.status === "OK") {
        return data.predictions.map((prediction) => prediction.description);
      }
    } catch (error) {
      console.error(`Error fetching ${type} suggestions:`, error);
    }

    return [];
  };

  const handleCityInputChange = async (input) => {
    setLoadingCities(true);
    const suggestions = await fetchSuggestions(input, "(cities)");
    setCities(suggestions);
    setLoadingCities(false);
  };

  const handleAddressInputChange = async (input) => {
    setLoadingAddress(true);
    const suggestions = await fetchSuggestions(input, "geocode");
    setAddressSuggestions(suggestions);
    setLoadingAddress(false);
  };

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe", icon: "user", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "example@mail.com", icon: "mail", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: "lock", required: true },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "123-456-7890", icon: "user", required: true },
    { name: "age", label: "Age", type: "number", placeholder: "Enter your age", icon: null, required: true },
    { name: "usn", label: "USN (if RVCE student)", type: "text", placeholder: "Enter your USN", icon: null, required: false },
    {
      name: "address",
      label: "Address",
      type: "autocomplete",
      placeholder: "Start typing your address...",
      suggestions: addressSuggestions,
      onInputChange: handleAddressInputChange,
      loading: loadingAddress,
      required: true,
    },
    {
      name: "city",
      label: "City",
      type: "autocomplete",
      placeholder: "Start typing your city...",
      suggestions: cities,
      onInputChange: handleCityInputChange,
      loading: loadingCities,
      required: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "dropdown",
      placeholder: "Select your gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
      required: true,
    },
    {
      name: "resume",
      label: "Upload Resume",
      type: "file",
      placeholder: "Upload your resume",
      icon: null,
      required: true,
    },
  ];

  const dropdowns = [
    {
      name: "occupation",
      label: "Occupation",
      placeholder: "Select your occupation",
      options: [
        { value: "teacher", label: "Teacher" },
        { value: "engineer", label: "Engineer" },
        { value: "doctor", label: "Doctor" },
        { value: "artist", label: "Artist" },
        { value: "student", label: "Student" },
        { value: "freelancer", label: "Freelancer" },
        { value: "business", label: "Business Owner" },
        { value: "retired", label: "Retired" },
        { value: "self_employed", label: "Self-employed" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },
    {
      name: "subject",
      label: "Subjects Comfortable Teaching",
      placeholder: "Select a subject",
      options: [
        { value: "math", label: "Mathematics" },
        { value: "science", label: "Science" },
        { value: "english", label: "English" },
        { value: "history", label: "History" },
        { value: "geography", label: "Geography" },
        { value: "physics", label: "Physics" },
        { value: "chemistry", label: "Chemistry" },
        { value: "biology", label: "Biology" },
        { value: "computer", label: "Computer Science" },
        { value: "arts", label: "Arts" },
      ],
      required: false,
    },
    {
      name: "languages",
      label: "Languages Comfortable With",
      placeholder: "Select languages",
      options: [
        { value: "hindi", label: "Hindi" },
        { value: "tamil", label: "Tamil" },
        { value: "telugu", label: "Telugu" },
        { value: "marathi", label: "Marathi" },
        { value: "bengali", label: "Bengali" },
        { value: "gujarati", label: "Gujarati" },
        { value: "kannada", label: "Kannada" },
        { value: "malayalam", label: "Malayalam" },
        { value: "punjabi", label: "Punjabi" },
        { value: "odia", label: "Odia" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },
  ];


  return (
    <div>
      <RegistrationForm
        fields={fields}
        isNotEnd={false}
        isFirst={true}
        isVol={true}
        dropdowns={dropdowns}
      />
      {/* Resume Viewer */}
      {resumeFile && (
        <div className="mt-4">
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => setShowResume(!showResume)}
          >
            {showResume ? "Hide Resume" : "View Resume"}
          </button>
          {showResume && (
            <div className="mt-2 p-4 border border-gray-300 rounded-lg">
              <iframe
                src={URL.createObjectURL(resumeFile)}
                title="Resume"
                className="w-full h-64"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerRegistration;