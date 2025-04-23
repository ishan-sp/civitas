import React from "react";

const Popup = ({ message, buttons, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        {/* Success Message */}
        <h2 className="text-2xl font-bold text-yellow-500">{message}</h2>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {buttons.map(({ label, onClick, link }, index) => (
            link ? (
              <a
                key={index}
                href={link}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold shadow transition"
              >
                {label}
              </a>
            ) : (
              <button
                key={index}
                onClick={onClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold shadow transition"
              >
                {label}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;