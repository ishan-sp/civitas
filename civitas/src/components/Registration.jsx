import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const RegistrationForm = ({ fields = [], dropdowns = [], onSubmit }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [filePreview, setFilePreview] = useState(null); // For file preview

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (e.target.type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setFilePreview(URL.createObjectURL(files[0])); // Generate preview URL
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8F1] flex items-start justify-center p-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 mt-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
              <p className="text-gray-600">Fill in the details to create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render Fields */}
              {fields.map((field, index) => (
                <div key={index} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <div className="relative">
                    {field.type === "file" ? (
                      <>
                        <input
                          type="file"
                          name={field.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          required={field.required}
                        />
                        {filePreview && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => window.open(filePreview, "_blank")}
                              className="text-blue-500 underline"
                            >
                              View Uploaded File
                            </button>
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

<div className="col-span-1 md:col-span-2 flex flex-col gap-4 mt-6 items-center">
  <button
    type="submit"
    className="bg-yellow-300 text-black py-3 px-6 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium w-1/2"
  >
    <span>Register</span>
    <ArrowRight className="h-5 w-5" />
  </button>
  <button
    type="button"
    onClick={() => window.location.href = "/login"}  // Redirect to /login
    className="bg-gray-200 text-black py-3 px-6 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium w-1/2"
  >
    <span>Back</span>
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