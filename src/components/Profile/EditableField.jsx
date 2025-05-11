import React, { useState } from "react";

const EditableField = ({ label, name, value, type, required, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  const handleSave = () => {
    onSave(name, tempValue);
    setEditMode(false);
  };

  const handleDiscard = () => {
    setTempValue(value || "");
    setEditMode(false);
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
      <label className="block text-gray-700 text-sm font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {editMode ? (
        <>
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <div className="flex mt-3 space-x-2">
            <button
              className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-md shadow-sm hover:bg-yellow-200"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm hover:bg-gray-200"
              onClick={handleDiscard}
            >
              Discard
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-gray-900">{value || "—"}</span>
          <button
            className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-100"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
