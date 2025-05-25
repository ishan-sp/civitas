import { useState } from "react";
import CollapseNavbar from "./CollapseNavbar";
import TopNavbar from "./TopNavbar";
import { FaHome, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import School from "./School/School";

export default function SchoolManagement() {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null); // track clicked card

  const navLinks = [
    {
      name: "Home",
      href: "/dashboard/vol/ngomanagement/my-schools?ngo=6kH7pFkrcHd6qV53qqhiKkLEBLB2",
      icon: <FaHome />,
    },
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
      {/* Top Navbar */}
      <TopNavbar user_type="School" collapsed={collapsed} />

      {/* Layout with Sidebar */}
      <div className="flex flex-1 pt-16">
        <CollapseNavbar
          links={navLinks}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main Content */}
        <main
          className="p-8 transition-all duration-300 ease-in-out flex-1 overflow-y-auto"
          style={{ marginLeft: collapsed ? "5rem" : "16rem" }}
        >
          {/* Show full class dashboard if one is selected */}
          {selectedClass ? (
            <School classData={selectedClass} />
          ) : (
            <div className="w-full max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">My Classes</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {classData.map((cls, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedClass(cls)} // on card click
                    className="cursor-pointer bg-white shadow-md hover:shadow-xl border border-gray-100 rounded-2xl p-8 transition duration-300"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {cls.title}
                        </h2>
                        <p className="text-sm text-gray-500">Grade {cls.grade}</p>
                      </div>
                      <span
                        className={`text-white px-4 py-2 rounded-full text-base font-semibold ${cls.color}`}
                      >
                        {cls.title.charAt(0)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-6 text-base">
                      Instructor: <span className="font-medium">{cls.instructor}</span>
                    </p>
                    <div className="flex gap-6 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <FaChalkboardTeacher className="text-lg" />
                        <span>Teacher</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-lg" />
                        <span>Schedule</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
