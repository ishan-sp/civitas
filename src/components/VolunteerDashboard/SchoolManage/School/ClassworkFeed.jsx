export default function ClassworkFeed() {
  const classwork = [
    { title: "Chapter 1 Notes", type: "Material", date: "May 15, 2025" },
    { title: "Quiz: Algebra", type: "Quiz", date: "May 18, 2025" },
  ];

  return (
    <section className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Classwork Feed</h2>
      <ul className="space-y-3">
        {classwork.map((item, i) => (
          <li key={i} className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.type}</p>
            </div>
            <span className="text-sm text-gray-400">{item.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
