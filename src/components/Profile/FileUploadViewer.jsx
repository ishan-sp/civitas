import React, { useState } from "react";

const FileUploadViewer = ({ label, name, fileUrl, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [newFile, setNewFile] = useState(null);

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
      <label className="block text-gray-700 text-sm font-semibold mb-1">
        {label}
      </label>

      {fileUrl && !editing && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View Current File
        </a>
      )}

      {editing ? (
        <>
          <input
            type="file"
            onChange={(e) => setNewFile(e.target.files[0])}
            className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
          />
          <div className="flex mt-3 space-x-2">
            <button
              className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-md shadow-sm hover:bg-yellow-200"
              onClick={() => {
                onSave(name, newFile);
                setEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm hover:bg-gray-200"
              onClick={() => {
                setNewFile(null);
                setEditing(false);
              }}
            >
              Discard
            </button>
          </div>
        </>
      ) : (
        <div className="mt-2">
          <button
            className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-100"
            onClick={() => setEditing(true)}
          >
            Replace File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadViewer;
