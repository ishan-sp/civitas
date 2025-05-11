import React from "react";
import celebrateGif from "../assets/images/celebrate.gif";

const Popup = ({ message, buttons, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center space-y-6 transition-all duration-300 ease-in-out">
        {/* Message */}
        <h2
          id="popup-title"
          className="text-2xl md:text-3xl font-semibold text-black tracking-tight"
        >
          {message}
        </h2>

        {/* GIF with aspect ratio control */}
        <div className="flex justify-center">
          <img
            src={celebrateGif}
            alt="Celebration"
            className="object-contain max-h-48 w-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {buttons.map(({ label, onClick, link }, index) =>
            link ? (
              <a
                key={index}
                href={link}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-colors duration-200"
              >
                {label}
              </a>
            ) : (
              <button
                key={index}
                onClick={onClick}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-colors duration-200"
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
