import React, { useState } from "react";
import { format, parse } from "date-fns";

// Helper to extract day, time
const parseEvent = (entry) => {
  const [date, timeRange] = entry.split(" ");
  const [startTime, endTime] = timeRange.split("-");
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  const displayDate = format(parsedDate, "MMM d (EEE)");
  return { displayDate, startTime, endTime };
};

const Calendar = ({ classes = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">📚 Class Calendar</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {classes.flatMap((cls) =>
          cls.classes.map((eventString, index) => {
            const { displayDate, startTime, endTime } = parseEvent(eventString);
            return (
              <div
                key={`${cls.title}-${index}`}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500 hover:bg-blue-50 cursor-pointer transition"
                onClick={() =>
                  setSelectedEvent({
                    title: cls.title,
                    teacher: cls.teacher,
                    section: cls.section,
                    date: displayDate,
                    startTime,
                    endTime,
                  })
                }
              >
                <h2 className="text-lg font-semibold text-blue-800">{cls.title}</h2>
                <p className="text-sm text-gray-600">👨‍🏫 {cls.teacher}</p>
                <p className="text-sm text-gray-600">🧾 Section: {cls.section}</p>
                <p className="text-sm mt-2 text-gray-800">📅 {displayDate}</p>
                <p className="text-sm text-gray-700">🕒 {startTime} - {endTime}</p>
              </div>
            );
          })
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
            <p className="text-sm mb-1">👨‍🏫 {selectedEvent.teacher}</p>
            <p className="text-sm mb-1">🧾 Section: {selectedEvent.section}</p>
            <p className="text-sm mb-1">📅 {selectedEvent.date}</p>
            <p className="text-sm mb-4">🕒 {selectedEvent.startTime} - {selectedEvent.endTime}</p>
            <div className="flex justify-between">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  alert("Class Accepted!");
                  setSelectedEvent(null);
                }}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  alert("Class Rejected!");
                  setSelectedEvent(null);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
