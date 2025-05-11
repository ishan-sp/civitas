import React from "react";

const applications = [
  { id: 1, school: "Coastal High School", status: "Pending", appliedOn: "2025-04-05" },
  { id: 2, school: "Riverdale Academy", status: "Accepted", appliedOn: "2025-03-20" },
];

const statusColor = {
  Pending: "text-yellow-500",
  Accepted: "text-green-600",
  Rejected: "text-red-500",
};

const SchoolApplications = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your School Applications</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="px-6 py-3">School</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="px-6 py-4 font-medium">{app.school}</td>
                <td className={`px-6 py-4 font-semibold ${statusColor[app.status]}`}>{app.status}</td>
                <td className="px-6 py-4 text-gray-500">{app.appliedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolApplications;
