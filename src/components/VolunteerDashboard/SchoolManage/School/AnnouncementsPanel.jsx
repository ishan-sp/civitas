import AnnouncementForm from "./AnnouncementForm";

export default function AnnouncementsPanel() {
  const announcements = [
    { title: "PTM on June 1st", content: "Please attend with your ward." },
    { title: "Holiday Notice", content: "School will remain closed on May 29." },
  ];

  return (
    <section className="bg-white shadow-md rounded-xl p-6 col-span-1 md:col-span-2">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Announcements</h2>
      <AnnouncementForm />
      <ul className="mt-4 space-y-3">
        {announcements.map((a, i) => (
          <li key={i} className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm text-gray-600">{a.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
