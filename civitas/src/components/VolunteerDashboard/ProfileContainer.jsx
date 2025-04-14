import React, { useState, useEffect } from "react";

const ProfileContainer = ({ profileData }) => {
  const [editableData, setEditableData] = useState(null);
  const [editingField, setEditingField] = useState(null);

  // Update local state when profileData is received
  useEffect(() => {
    if (profileData) {
      setEditableData(profileData);
    }
  }, [profileData]);

  const handleEdit = (fieldName) => {
    setEditingField(fieldName);
  };

  const handleSave = (fieldName) => {
    console.log(`Updated ${fieldName}:`, editableData[fieldName]);
    // Ideally: send updated data to backend here
    setEditingField(null);
  };

  const handleInputChange = (fieldName, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // 🔐 Guard: only render once data is available
  if (!editableData) {
    return <div className="text-center text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h3>
      <div className="space-y-4">
        {Object.keys(editableData).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">{key}</label>
            {editingField === key ? (
              key.toLowerCase().includes("file") || key.toLowerCase().includes("document") ? (
                <input
                  type="file"
                  onChange={(e) => handleInputChange(key, e.target.files[0])}
                  className="border border-gray-300 rounded-lg px-2 py-1"
                />
              ) : (
                <input
                  type="text"
                  value={editableData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              )
            ) : key.toLowerCase().includes("file") || key.toLowerCase().includes("document") ? (
              <a
                href={editableData[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View File
              </a>
            ) : (
              <span className="text-gray-800">{editableData[key]}</span>
            )}
            {editingField === key ? (
              <button
                onClick={() => handleSave(key)}
                className="ml-4 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEdit(key)}
                className="ml-4 bg-yellow-300 text-black py-1 px-3 rounded-lg hover:bg-yellow-400 transition-all"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileContainer;
