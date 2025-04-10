// src/components/StudentDashboard/MyCalendar.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Required for react-modal to attach to the DOM
Modal.setAppElement('#root');

const MyCalendar = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: '90vh', padding: '20px' }}>
      <h1 className="text-3xl font-bold text-center mb-4">Class Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        onSelectEvent={handleSelectEvent}
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
          },
        }}
      >
        {selectedEvent && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{selectedEvent.title}</h2>
            <p><strong>Teacher:</strong> {selectedEvent.teacher}</p>
            <p><strong>Section:</strong> {selectedEvent.section}</p>
            <p><strong>Start:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm A')}</p>
            <p><strong>End:</strong> {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm A')}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyCalendar;
