import React, { useState } from "react";

const TextareaField = ({ label, name, value, required, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");

  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      {editing ? (
        <>
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            required={required}
            className="border p-2 rounded w-full h-24"
          />
          <div className="mt-2 flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => { onSave(name, localValue); setEditing(false); }}>Save</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { setLocalValue(value); setEditing(false); }}>Discard</button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-start">
          <p>{value || "Not set"}</p>
          <button className="text-blue-500 underline ml-2" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default TextareaField;
