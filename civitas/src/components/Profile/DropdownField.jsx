import React, { useState } from "react";

const DropdownField = ({ label, name, value, options, required, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(value || "");

  const currentLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
      <label className="block text-gray-700 text-sm font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {editing ? (
        <>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <option value="">Select...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex mt-3 space-x-2">
            <button
              className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-md shadow-sm hover:bg-yellow-200"
              onClick={() => {
                onSave(name, selected);
                setEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm hover:bg-gray-200"
              onClick={() => {
                setSelected(value);
                setEditing(false);
              }}
            >
              Discard
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-gray-900">{currentLabel || "—"}</span>
          <button
            className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-100"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownField;
