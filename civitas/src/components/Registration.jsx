import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const RegistrationForm = ({ fields = [], dropdowns = [], onSubmit }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8F1] flex items-center justify-center p-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Register
              </h1>
              <p className="text-gray-600">
                Fill in the details to create your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field, index) => (
                <div key={index}>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    {field.icon === "user" && (
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    )}
                    {field.icon === "mail" && (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    )}
                    {field.icon === "lock" && (
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    )}
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </div>
                </div>
              ))}

              {dropdowns.map((dropdown, index) => (
                <div key={index}>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor={dropdown.name}
                  >
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

              <button
                type="submit"
                className="w-full bg-yellow-300 text-black py-3 px-4 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium"
              >
                <span>Register</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;