import { Routes, Route, Link, useLocation } from "react-router-dom";
import ClassCard from "./ClassCard";
import SidebarItem from "./Sidebar";
import TopNavbar from "./TopNavbar";
import MyCalendar from "./MyCalendar";
import ClassInfo from "./ClassInfo";

// Sample class and calendar data
const classData = [
  {
    title: "Mathematics",
    teacher: "Mr Prasanna",
    section: "Grade 5B",
    avatarColor: "bg-red-600",
    bannerColor: "bg-gray-700",
    path: "/dashboard/stud/classInfo",
  },
  {
    title: "Political Science",
    teacher: "Ms Rekha",
    section: "Grade 5B",
    avatarColor: "bg-green-600",
    bannerColor: "bg-slate-600",
    path: "/dashboard/stud/classInfo",
  },
  {
    title: "Biology",
    teacher: "Ms Shwetha",
    section: "Grade 5B",
    avatarColor: "bg-yellow-600",
    bannerColor: "bg-slate-600",
    path: "/dashboard/stud/classInfo",
  },
  {
    title: "Science",
    teacher: "Mr Rajgopalan",
    section: "Grade 5B",
    avatarColor: "bg-purple-600",
    bannerColor: "bg-gray-700",
    path: "/dashboard/stud/classInfo",
  },
  {
    title: "Kannada",
    teacher: "Ms Suman",
    section: "Grade 5B",
    avatarColor: "bg-red-600",
    bannerColor: "bg-teal-800",
    path: "/dashboard/stud/classInfo",
  },
];

const classesData = [
  {
    title: "IS234AT-LDCO",
    teacher: "Premananda B S",
    section: "IS A",
    classes: ["2025-04-10 10:00-11:00", "2025-04-12 14:00-15:00"],
  },
  {
    title: "CS1203-DataStructures",
    teacher: "Anita Gupta",
    section: "CS B",
    classes: ["2025-04-11 09:00-10:00", "2025-04-13 11:00-12:00"],
  },
];

const events = classesData.flatMap((classItem) =>
  classItem.classes.map((session) => {
    const [date, timeRange] = session.split(" ");
    const [startTime, endTime] = timeRange.split("-");
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    return {
      title: classItem.title,
      start,
      end,
      desc: `Lecture by ${classItem.teacher}`,
    };
  })
);

function StudDash() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 h-screen overflow-y-auto bg-gray-50 border-r border-gray-200 shadow-sm">
        <div className="p-5 font-semibold text-xl text-gray-800 border-b border-gray-200">
          Enrolled
        </div>
        <ul className="space-y-1 py-2 px-1">
          {/* Home Button */}
          <li>
            <Link
              to="/dashboard/stud"
              className={`flex items-center gap-3 px-4 py-3 ${
                location.pathname === "/dashboard/stud"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700"
              } hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200`}
            >
              <span className="text-lg font-medium">Home</span>
            </Link>
          </li>

          {/* Calendar Button */}
          <li>
            <Link
              to="/dashboard/stud/calendar"
              className={`flex items-center gap-3 px-4 py-3 ${
                location.pathname === "/dashboard/stud/calendar"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700"
              } hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200`}
            >
              <span className="text-lg font-medium">Calendar</span>
            </Link>
          </li>

          {/* Enrolled Classes List */}
          {classData.map((classItem, index) => (
            <SidebarItem key={index} data={classItem} />
          ))}
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            {/* Default home route */}
            <Route
              index
              element={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center">
                  {classData.map((classItem, index) => (
                    <ClassCard key={index} data={classItem} />
                  ))}
                </div>
              }
            />

            {/* Nested routes for class info and calendar */}
            <Route path="calendar" element={<MyCalendar events={events} />} />
            <Route path="classInfo" element={<ClassInfo />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default StudDash;
