import React, { useState } from "react";

const FileUploadViewer = ({ label, name, fileUrl, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [newFile, setNewFile] = useState(null);

  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Current File</a>}
      {editing ? (
        <>
          <input type="file" onChange={(e) => setNewFile(e.target.files[0])} className="block mt-2" />
          <div className="mt-2 flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => { onSave(name, newFile); setEditing(false); }}>Save</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { setNewFile(null); setEditing(false); }}>Discard</button>
          </div>
        </>
      ) : (
        <button className="text-blue-500 underline mt-1" onClick={() => setEditing(true)}>Replace File</button>
      )}
    </div>
  );
};

export default FileUploadViewer;
