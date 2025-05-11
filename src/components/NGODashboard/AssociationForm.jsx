import React, { useState } from "react";

export default function AssociationForm({
  isOpen,
  onClose,
  schoolName,
  schoolId,
}) {
  const [formData, setFormData] = useState({
    ngoName: "",
    registrationNumber: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    purpose: "",
    supportTypes: {
      infrastructure: false,
      teacherTraining: false,
      learningMaterials: false,
      healthHygiene: false,
      digitalLiteracy: false,
      extracurricular: false,
      other: false,
    },
    otherSupportType: "",
    startDate: "",
    endDate: "",
    pastExperience: "",
    consentChecked: false,
  });

  const [documents, setDocuments] = useState({
    proposal: null,
    certificate: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name.startsWith("supportType-")) {
        const supportType = name.replace("supportType-", "");
        setFormData({
          ...formData,
          supportTypes: {
            ...formData.supportTypes,
            [supportType]: checked,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments({
      ...documents,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (no actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    }, 1000); // Simulate network delay
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-10">
              <div className="text-green-600 text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Association Request Submitted
              </h2>
              <p className="text-gray-600">
                Your request to associate with {schoolName} has been submitted
                successfully. You will be contacted once the school or district
                authority reviews your request.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  📝 NGO Details Form
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* 1. NGO Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    1. NGO Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NGO Name
                      </label>
                      <input
                        type="text"
                        name="ngoName"
                        value={formData.ngoName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Point of Contact Name
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website (optional)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Nature of Association */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    2. Nature of Association
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Association
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="e.g., improving literacy, digital education, etc."
                      className="w-full p-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Support Offered
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-infrastructure"
                          checked={formData.supportTypes.infrastructure}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Infrastructure support
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-teacherTraining"
                          checked={formData.supportTypes.teacherTraining}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Teacher training
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-learningMaterials"
                          checked={formData.supportTypes.learningMaterials}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Learning materials
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-healthHygiene"
                          checked={formData.supportTypes.healthHygiene}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Health & hygiene programs
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-digitalLiteracy"
                          checked={formData.supportTypes.digitalLiteracy}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Digital literacy
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-extracurricular"
                          checked={formData.supportTypes.extracurricular}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Extracurricular activities
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="supportType-other"
                          checked={formData.supportTypes.other}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Other
                      </label>
                    </div>

                    {formData.supportTypes.other && (
                      <div className="mt-2">
                        <input
                          type="text"
                          name="otherSupportType"
                          value={formData.otherSupportType}
                          onChange={handleChange}
                          placeholder="Please specify"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Duration of Engagement */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    3. Duration of Engagement
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proposed Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proposed End Date (optional or ongoing)
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Past Experience */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    4. Past Experience (Optional)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe previous work in similar schools
                    </label>
                    <textarea
                      name="pastExperience"
                      value={formData.pastExperience}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </div>

                {/* 5. Supporting Documents */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    5. Supporting Documents
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload proposal document (PDF/doc)
                      </label>
                      <input
                        type="file"
                        name="proposal"
                        onChange={handleFileChange}
                        required
                        accept=".pdf,.doc,.docx"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload NGO Registration Certificate (optional but
                        recommended)
                      </label>
                      <input
                        type="file"
                        name="certificate"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Consent & Declaration */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    6. Consent & Declaration
                  </h3>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="consentChecked"
                        checked={formData.consentChecked}
                        onChange={handleChange}
                        required
                        className="mt-1 mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that the above information is true and I am
                        authorized to make this request on behalf of my
                        organization.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Send Association Request"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
