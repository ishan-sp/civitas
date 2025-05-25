import { useState } from "react";
import CollapseNavbar from "./CollapseNavbar";
import TopNavbar from "./TopNavbar";
import { FaHome, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";

export default function SchoolManagement() {
  const [collapsed, setCollapsed] = useState(true);

  const navLinks = [
    { name: "Home", href: "/home", icon: <FaHome /> },
    { name: "Calendar", href: "/calendar", icon: <FaCalendarAlt /> },
    { name: "Classes", href: "/classes", icon: <FaChalkboardTeacher /> },
  ];

  const classData = [
    { title: "Mathematics", instructor: "Mr. Prasanna", grade: "5B", color: "bg-red-600" },
    { title: "Political Science", instructor: "Ms. Rekha", grade: "5B", color: "bg-green-600" },
    { title: "Biology", instructor: "Ms. Shwetha", grade: "5B", color: "bg-yellow-700" },
    { title: "Science", instructor: "Ms. Anu", grade: "5B", color: "bg-purple-600" },
    { title: "Kannada", instructor: "Mr. Ravi", grade: "5B", color: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Top Navbar */}
      <TopNavbar user_type="School" collapsed={collapsed} />

      {/* Body Layout: Collapsible Sidebar + Main Content */}
      <div className="flex flex-1 pt-16">
        <CollapseNavbar links={navLinks} collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Classes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classData.map((cls, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{cls.title}</h2>
                    <p className="text-sm text-gray-500">Grade {cls.grade}</p>
                  </div>
                  <span
                    className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${cls.color}`}
                  >
                    {cls.title.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">Instructor: {cls.instructor}</p>
                <div className="flex gap-4 text-gray-600">
                  <div className="flex items-center">
                    <FaChalkboardTeacher />
                    <span className="ml-2 text-sm">Teacher</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt />
                    <span className="ml-2 text-sm">Schedule</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
