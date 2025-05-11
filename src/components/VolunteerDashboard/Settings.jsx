import React, { useState, useEffect } from "react";
import DropdownField from "../Profile/DropdownField";
import EditableField from "../Profile/EditableField";
import FileUploadViewer from "../Profile/FileUploadViewer";
import TextAreaField from "../Profile/TextAreaField";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../../firebase";

const Settings = ({ user }) => {
  const [profileData, setProfileData] = useState(null); // Initially null until data is fetched
  const [loading, setIsLoading] = useState(true);
  const [error, setHasError] = useState(null);

  // Field definitions from VolunteerSignupRoute
  const fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "age", label: "Age", type: "number", required: true },
    { name: "gender", label: "Gender", type: "dropdown", required: true },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "occupation", label: "Occupation", type: "dropdown", required: true },
    { name: "subject", label: "Subjects Comfortable Teaching", type: "dropdown", required: false },
    { name: "languages", label: "Languages Comfortable With", type: "dropdown", required: true },
    { name: "resume", label: "Resume", type: "file", required: true },
  ];

  // Dropdown options (from VolunteerSignupRoute)
  const dropdownOptions = {
    gender: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
    occupation: [
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
    subject: [
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
    languages: [
      { value: "english", label: "English" },
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
  };

  // Fetch profile data from the server
  useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, async (user) => {
       if (user) {
         setIsLoading(true);
         setHasError(false);
         const idToken = await user.getIdToken();
         const response = await fetch("http://localhost:3000/user-profile", {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${idToken}`,
           },
         });
         if (response.ok) {
           const data = await response.json();
           setProfileData(data);
         }
         else {
           console.error("Failed to fetch profile data");
           setHasError(true);
         }
         setIsLoading(false);
       }
     });
 
     return () => unsubscribe();
   }, [user]);

  // Handle save for editable fields
  const handleSave = (name, value) => {
    setProfileData((prev) => ({ ...prev, [name]: value }));
    console.log(`Updated ${name}:`, value);
  };

  if (loading) {
    return <div className="text-center text-gray-600 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl">{error}</div>;
  }

  return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Volunteer Settings</h1>
    <div className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg">
      {fields.map((field) => {
        const value = profileData[field.name];
        const isRequired = field.required;

        switch (field.type) {
          case "text":
          case "email":
          case "tel":
          case "number":
            return (
              <EditableField
                key={field.name}
                label={field.label}
                name={field.name}
                value={value}
                type={field.type}
                required={isRequired}
                onSave={handleSave}
              />
            );

          case "dropdown":
            return (
              <DropdownField
                key={field.name}
                label={field.label}
                name={field.name}
                value={value}
                options={dropdownOptions[field.name] || []}
                required={isRequired}
                onSave={handleSave}
              />
            );

          case "textarea":
            return (
              <TextAreaField
                key={field.name}
                label={field.label}
                name={field.name}
                value={value}
                required={isRequired}
                onSave={handleSave}
              />
            );

          case "file":
            return (
              <FileUploadViewer
                key={field.name}
                label={field.label}
                name={field.name}
                fileUrl={value}
                onSave={handleSave}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  </div>
);

};

export default Settings;