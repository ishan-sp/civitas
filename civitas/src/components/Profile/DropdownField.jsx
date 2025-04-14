import React, { useState } from "react";

const DropdownField = ({ label, name, value, options, required, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(value || "");

  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      {editing ? (
        <>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required={required}
            className="border p-2 rounded w-full"
          >
            <option value="">Select...</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="mt-2 flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => { onSave(name, selected); setEditing(false); }}>Save</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { setSelected(value); setEditing(false); }}>Discard</button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <span>{options.find(opt => opt.value === value)?.label || "Not set"}</span>
          <button className="text-blue-500 underline" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default DropdownField;
