export default function AssignmentsList() {
  const assignments = [
    { title: "Math Homework", due: "May 28, 2025", status: "Pending" },
    { title: "Science Lab Report", due: "May 30, 2025", status: "Submitted" },
  ];

  return (
    <section className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assignments</h2>
      <ul className="space-y-4">
        {assignments.map((a, i) => (
          <li key={i} className="border-b pb-2">
            <div className="flex justify-between">
              <span>{a.title}</span>
              <span className="text-sm text-gray-500">{a.due}</span>
            </div>
            <span className={`text-sm ${a.status === "Pending" ? "text-red-500" : "text-green-500"}`}>
              {a.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
