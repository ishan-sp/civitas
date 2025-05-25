import TopNavbar from "./TopNavbar";
import CollapseNavbar from "./CollapseNavbar";
import ClassHeader from "./ClassHeader";
import ClassworkFeed from "./ClassworkFeed";
import AssignmentsList from "./AssignmentsList";
import AnnouncementsPanel from "./AnnouncementsPanel";
import CalendarPanel from "./CalendarPanel";

export default function ClassDashboard({ classData, collapsed, setCollapsed }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavbar user_type="Teacher" collapsed={collapsed} />
      <div className="flex flex-1 pt-16">
        <CollapseNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className="p-8 overflow-y-auto transition-all duration-300 ease-in-out flex-1"
          style={{ marginLeft: collapsed ? "5rem" : "16rem" }}
        >
          <ClassHeader classData={classData} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ClassworkFeed />
            <AssignmentsList />
            <AnnouncementsPanel />
            <CalendarPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
