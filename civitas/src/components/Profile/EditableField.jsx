import React, { useState } from "react";

const EditableField = ({ label, name, value, type = "text", required, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");

  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      {editing ? (
        <>
          <input
            type={type}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            required={required}
            className="border p-2 rounded w-full"
          />
          <div className="mt-2 flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => { onSave(name, localValue); setEditing(false); }}>Save</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { setLocalValue(value); setEditing(false); }}>Discard</button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <span>{value || "Not set"}</span>
          <button className="text-blue-500 underline" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
