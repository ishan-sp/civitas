import React, { useState } from "react";
import RegistrationForm from "../components/Registration";

const NGORegistration = () => {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

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

  // Block 1: Basic Information
  const basicInfoFields = [
    { name: "ngoName", label: "NGO Name", type: "text", placeholder: "Enter NGO Name", required: true },
    { name: "registrationNumber", label: "NGO Registration Number", type: "text", placeholder: "Enter Registration Number", required: true },
    {
      name: "regionsOfOperation",
      label: "Regions of Operation",
      type: "dynamic", // Dynamic field for adding/removing regions
      placeholder: "Enter a region",
      required: true,
    },
    { name: "website", label: "NGO Website Link", type: "url", placeholder: "Enter Website URL", required: false },
    { name: "instagram", label: "NGO Instagram Link", type: "url", placeholder: "Enter Instagram URL", required: false },
    { name: "facebook", label: "NGO Facebook Link", type: "url", placeholder: "Enter Facebook URL", required: false },
    { name: "youtube", label: "NGO YouTube Link", type: "url", placeholder: "Enter YouTube URL", required: false },
    { name: "linkedin", label: "NGO LinkedIn Link", type: "url", placeholder: "Enter LinkedIn URL", required: false },
  ];

  // Block 2: Mission and Programs
  const missionAndProgramsFields = [
    { name: "missionStatement", label: "Mission Statement", type: "textarea", placeholder: "Enter Mission Statement", required: true },
    { name: "programDetails", label: "Program Details", type: "textarea", placeholder: "Describe your programs", required: true },
  ];

  // Dropdowns for Mission and Programs
  const missionAndProgramsDropdowns = [
    {
      name: "fundingDetails",
      label: "Funding Details",
      placeholder: "Select funding sources",
      options: [
        { value: "individuals", label: "Donations from Individuals" },
        { value: "corporate", label: "Corporate Sponsorships" },
        { value: "government", label: "Government Grants" },
        { value: "international", label: "International Grants" },
        { value: "crowdfunding", label: "Crowdfunding" },
        { value: "events", label: "Fundraising Events" },
        { value: "partnerships", label: "Partnerships with Other NGOs" },
        { value: "membership", label: "Membership Fees" },
        { value: "foundation", label: "Foundation/Philanthropy Support" },
        { value: "income", label: "Income from Sale of Goods/Services" },
      ],
      required: true,
    },
    {
      name: "typeOfNGO",
      label: "Type of NGO",
      placeholder: "Select NGO Type",
      options: [
        { value: "trust", label: "Charitable Trust" },
        { value: "society", label: "Society" },
        { value: "section8", label: "Section 8 Company" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },
  ];

  // Block 3: Contact Information
  const contactInfoFields = [
    { name: "primaryContact", label: "Primary Contact Person", type: "text", placeholder: "Enter Name", required: true },
    { name: "contactRole", label: "Position/Role of Contact Person", type: "text", placeholder: "Enter Role", required: true },
    { name: "email", label: "Organisation Email Address", type: "email", placeholder: "Enter Email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: "lock", required: true },
    { name: "phone", label: "Organisation Phone Number", type: "tel", placeholder: "Enter Phone Number", required: true },
    {
      name: "address",
      label: "Registered Address",
      type: "autocomplete",
      placeholder: "Start typing your address...",
      suggestions: addressSuggestions,
      onInputChange: handleAddressInputChange,
      loading: loadingAddress,
      required: true,
    },
    { name: "alternateContact", label: "Alternate Contact Information", type: "text", placeholder: "Enter Alternate Email or Phone", required: false },
  ];

  // Block 4: Documentation and Impact
  const documentationAndImpactFields = [
    {
      name: "registrationCertificate",
      label: "NGO Registration Certificate",
      type: "file",
      placeholder: "Upload Registration Certificate",
      required: true,
    },
    {
      name: "proofOfAddress",
      label: "Proof of Address",
      type: "file",
      placeholder: "Upload Proof of Address",
      required: true,
    },
    {
      name: "taxExemptionCertificate",
      label: "Tax Exemption Certificate (if applicable)",
      type: "file",
      placeholder: "Upload Tax Exemption Certificate",
      required: false,
    },
    {
      name: "panTanDetails",
      label: "PAN/TAN Details (if applicable)",
      type: "file",
      placeholder: "Upload PAN/TAN Details",
      required: false,
    },
    {
      name: "auditReport",
      label: "Audit Report or Financial Statement",
      type: "file",
      placeholder: "Upload Audit Report or Financial Statement",
      required: false,
    },
    { name: "impactMetrics", label: "Impact Metrics", type: "textarea", placeholder: "Describe impact metrics", required: false },
    { name: "volunteerCount", label: "Number of Volunteers", type: "number", placeholder: "Enter Number of Volunteers", required: false },
    { name: "volunteerRoles", label: "Types of Volunteers Needed", type: "textarea", placeholder: "Describe Volunteer Roles", required: false },
    { name: "programDescription", label: "Detailed Description of Current Programs", type: "textarea", placeholder: "Describe Current Programs", required: true },
  ];

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/register/ngo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register NGO");
      }

      const data = await response.json();
      console.log("NGO Registration successful:", data);
    } catch (error) {
      console.error("Error during NGO registration:", error);
    }
  };

  return (
    <div>
      {/* Block 1: Basic Information */}
      <RegistrationForm
        fields={basicInfoFields}
        isNotEnd={true}
        isFirst={true}
        isngo={true}
        onSubmit={(formData) => {
          handleSubmit(formData);
        }}
      />
  
      {/* Block 2: Mission and Programs */}
      <RegistrationForm
        fields={missionAndProgramsFields}
        dropdowns={missionAndProgramsDropdowns}
        isNotEnd={true}
        isngo={true}
        onSubmit={(formData) => {
          handleSubmit(formData);
        }}
      />
  
      {/* Block 3: Contact Information */}
      <RegistrationForm
        fields={contactInfoFields}
        isNotEnd={true}
        isngo={true}
        onSubmit={(formData) => {
          handleSubmit(formData);
        }}
      />
  
      {/* Block 4: Documentation and Impact */}
      <RegistrationForm
        fields={documentationAndImpactFields}
        isNotEnd={false} // Render Submit and Back buttons
        isngo={true}
        onSubmit={(formData) => {
          handleSubmit(formData);
        }}
      />
    </div>
  );
};

export default NGORegistration;