import React, { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationForm = ({ fields = [], dropdowns = [], onSubmit, isNotEnd = true, isVol = false, isStudent = false, isFirst = false, isngo = false }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      if (field.type === "dynamic") {
        acc[field.name] = [];
      } else {
        acc[field.name] = "";
      }
      return acc;
    }, dropdowns.reduce((acc, dropdown) => {
      acc[dropdown.name] = ""; // Initialize dropdown fields in formData
      return acc;
    }, {}))
  );

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (e.target.type === "file") {
      // Store the file object in the state
      setFormData({ ...formData, [name]: files[0] });
    } else if (e.target.tagName === "SELECT") {
      // Handle dropdowns: Find the selected option's label
      const selectedOption = dropdowns
        .find((dropdown) => dropdown.name === name)
        ?.options.find((option) => option.value === value);
  
      setFormData({ ...formData, [name]: selectedOption?.value || label });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDynamicAdd = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], ""],
    });
  };

  const handleDynamicRemove = (fieldName, index) => {
    const updatedList = [...formData[fieldName]];
    updatedList.splice(index, 1);
    setFormData({ ...formData, [fieldName]: updatedList });
  };

  const handleDynamicChange = (fieldName, index, value) => {
    const updatedList = [...formData[fieldName]];
    updatedList[index] = value;
    setFormData({ ...formData, [fieldName]: updatedList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fileFields = Object.keys(formData).filter((key) => formData[key] instanceof File);
      const textData = { ...formData };
      fileFields.forEach((key) => delete textData[key]);

      let fileUrls = [];
      if (fileFields.length > 0) {
        const formDataForFiles = new FormData();
        fileFields.forEach((key) => formDataForFiles.append("files", formData[key]));

        const uploadResponse = await fetch("https://civitas-rc0z.onrender.com/upload-files", {
          method: "POST",
          body: formDataForFiles,
        });

        if (!uploadResponse.ok) throw new Error("File upload failed");

        const uploadData = await uploadResponse.json();
        fileUrls = uploadData.file_urls;
      }

      const userType = isngo ? "NGO" : isVol ? "Volunteer" : isStudent ? "Student" : null;

      if (userType === "Volunteer") {
        textData.resume = fileUrls[0];
      } else if (userType === "NGO") {
        textData.RegistrationCertificate = fileUrls[0];
        textData.AddressProof = fileUrls[1];
        textData.TaxExemptionCertificate = fileUrls.length > 2 ? fileUrls[2] : null;
        textData.PANDetails = fileUrls.length > 2 ? fileUrls[3] : null;
        textData.AuditReportorFinancialStatement = fileUrls.length > 2 ? fileUrls[4] : null;
      }

      if (!userType) throw new Error("User type not specified");

      const response = await fetch("https://civitas-rc0z.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...textData, type: userType }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`${userType} registration successful!`);
      } else {
        alert(data.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const containerClasses = isngo
    ? "bg-[#FCF8F1] flex items-start justify-center"
    : "min-h-screen bg-[#FCF8F1] flex items-start justify-center p-4";

  const innerContainerClasses = isngo
    ? "container mx-auto flex flex-col items-center justify-center gap-6 mt-4"
    : "container mx-auto flex flex-col items-center justify-center gap-12 mt-12";

  return (
    <div className={containerClasses}>
      <div className={innerContainerClasses}>
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {isFirst && (
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
                <p className="text-gray-600">Fill in the details to create your account</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render Fields */}
              {fields.map((field, index) => (
                <div key={index} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <div className="relative">
                    {field.type === "dynamic" ? (
                      <>
                        {formData[field.name].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleDynamicChange(field.name, idx, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              placeholder={field.placeholder}
                            />
                            <button
                              type="button"
                              onClick={() => handleDynamicRemove(field.name, idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleDynamicAdd(field.name)}
                          className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Plus className="h-5 w-5" />
                          Add {field.label}
                        </button>
                      </>
                    ) : field.type === "file" ? (
                      <>
                        <input
                          type="file"
                          name={field.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        {/* File Preview */}
                        {formData[field.name] && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Uploaded File: {formData[field.name].name}</p>
                            <a
                              href={URL.createObjectURL(formData[field.name])}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View File
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Render Dropdowns */}
              {dropdowns.map((dropdown, index) => (
                <div key={index} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={dropdown.name}>
                    {dropdown.label}
                  </label>
                  <select
                    name={dropdown.name}
                    value={formData[dropdown.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required={dropdown.required}
                  >
                    <option value="" disabled>
                      {dropdown.placeholder}
                    </option>
                    {dropdown.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-4 mt-6">
                <Link
                  to="/login"
                  className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-medium w-1/2 text-center"
                >
                  Back
                </Link>
                <button
                  type="submit"
                  className="bg-yellow-300 text-black py-3 px-6 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium w-1/2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;