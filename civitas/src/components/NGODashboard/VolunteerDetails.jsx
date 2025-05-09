import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from "dayjs";

// Recharts imports
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';


// Example data - to be replaced with actual fetch from backend
const mockVolunteerData = {
  fullName: "John Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  age: 22,
  address: "123 Street, City",
  city: "Metropolis",
  gender: "Male",
  occupation: "Student",
  subjects: "Math, English",
  languages: "English, Hindi",
  resume: "",
  logs: [
    { date: "2025-04-01", hours: 2, time: "10:00", notes: "Morning session" },
    { date: "2025-04-02", hours: 3, time: "14:00", notes: "Afternoon session" },
    { date: "2025-04-04", hours: 1.5, time: "11:00", notes: "Morning session" },
    { date: "2025-04-05", hours: 2, time: "16:00", notes: "Evening session" },
    { date: "2025-04-07", hours: 3, time: "13:00", notes: "Afternoon session" },
  ],
};

const monthlyTrend = {};
const yearlyTrend = {};

mockVolunteerData.logs.forEach(log => {
  const month = dayjs(log.date).format("YYYY-MM");
  const year = dayjs(log.date).format("YYYY");

  monthlyTrend[month] = (monthlyTrend[month] || 0) + log.hours;
  yearlyTrend[year] = (yearlyTrend[year] || 0) + log.hours;
});

const monthlyTrendData = Object.entries(monthlyTrend).map(([month, hours]) => ({ month, hours }));
const yearlyTrendData = Object.entries(yearlyTrend).map(([year, hours]) => ({ year, hours }));

const VolunteerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);

  useEffect(() => {
    setVolunteer(mockVolunteerData);
  }, [id]);

  if (!volunteer) return <div>Loading...</div>;

  const totalHours = volunteer.logs.reduce((sum, log) => sum + log.hours, 0);
  const uniqueDates = volunteer.logs.map(log => log.date);
  const averageHours = totalHours / uniqueDates.length;

  const hourlyTrend = volunteer.logs.map(log => ({
    date: log.date,
    hours: log.hours,
  }));

  const hoursDistribution = [
    { name: '1-2 hours', value: volunteer.logs.filter(log => log.hours <= 2).length },
    { name: '2-3 hours', value: volunteer.logs.filter(log => log.hours > 2 && log.hours <= 3).length },
    { name: '3+ hours', value: volunteer.logs.filter(log => log.hours > 3).length },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Volunteer Header */}
      <div className="border border-gray-200 bg-gray-50 rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{volunteer.fullName}</h2>
          <button
            onClick={() => navigate("/dashboard/ngo/volunteers/current-volunteers")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Return
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Email:</strong> {volunteer.email}</p>
          <p><strong>Phone:</strong> {volunteer.phoneNumber}</p>
          <p><strong>Age:</strong> {volunteer.age}</p>
          <p><strong>City:</strong> {volunteer.city}</p>
          <p><strong>Gender:</strong> {volunteer.gender}</p>
          <p><strong>Occupation:</strong> {volunteer.occupation}</p>
          <p><strong>Subjects:</strong> {volunteer.subjects}</p>
          <p><strong>Languages:</strong> {volunteer.languages}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="border border-gray-200 bg-white rounded-md p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Volunteering Metrics</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Calendar
              tileClassName={({ date, view }) => {
                const dateStr = date.toISOString().split("T")[0];
                if (view === "month") {
                  return uniqueDates.includes(dateStr)
                    ? "bg-green-200" // Volunteered
                    : "bg-red-100";  // Not volunteered
                }
              }}
            />
          </div>
          

          <div className="text-sm space-y-4 text-gray-800">
  <div className="flex flex-wrap gap-4">
    <div className="bg-gray-100 p-3 rounded shadow text-center flex-1">
      <h5 className="text-xs uppercase text-gray-500">Total Hours</h5>
      <p className="text-xl font-semibold">{totalHours} hrs</p>
    </div>
    <div className="bg-gray-100 p-3 rounded shadow text-center flex-1">
      <h5 className="text-xs uppercase text-gray-500">Average / Day</h5>
      <p className="text-xl font-semibold">{averageHours.toFixed(2)} hrs</p>
    </div>
    <div className="bg-gray-100 p-3 rounded shadow text-center flex-1">
      <h5 className="text-xs uppercase text-gray-500">Active Days</h5>
      <p className="text-xl font-semibold">{uniqueDates.length}</p>
    </div>
  </div>
  <div>
    <h5 className="font-medium mb-2 text-gray-600">Volunteering Logs</h5>
    <ul className="list-disc list-inside space-y-1">
      {volunteer.logs.map((log, idx) => (
        <li key={idx} className="text-gray-700">
          <span className="font-semibold">{log.date}</span>: {log.hours} hours ({log.time})
        </li>
      ))}
    </ul>
  </div>
</div>

        </div>

        {/* Line Chart */}
        <div className="mt-8">
          <h4 className="font-semibold text-lg text-gray-800 mb-4">Volunteering Trend (Hours over Time)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="mt-8">
          <h4 className="font-semibold text-lg text-gray-800 mb-4">Volunteering Hours Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hoursDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {hoursDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Monthly Trend */}
<div className="mt-8">
  <h4 className="font-semibold text-lg text-gray-800 mb-4">Monthly Volunteering Trend</h4>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={monthlyTrendData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <RechartsTooltip />
      <Line type="monotone" dataKey="hours" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
</div>

{/* Yearly Trend */}
<div className="mt-8">
  <h4 className="font-semibold text-lg text-gray-800 mb-4">Yearly Volunteering Trend</h4>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={yearlyTrendData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <RechartsTooltip />
      <Line type="monotone" dataKey="hours" stroke="#ff7300" />
    </LineChart>
  </ResponsiveContainer>
</div>
      </div>

    </div>
  );
};

export default VolunteerDetails;
