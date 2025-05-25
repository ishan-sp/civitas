// ./School/School.jsx
import ClassHeader from "./ClassHeader";
import ClassworkFeed from "./ClassworkFeed";
import AssignmentsList from "./AssignmentsList";
import AnnouncementsPanel from "./AnnouncementsPanel";
import CalendarPanel from "./CalendarPanel";

export default function School({ classData }) {
  return (
    <div className="p-6">
      <ClassHeader classData={classData} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        <ClassworkFeed />
        <AssignmentsList />
        <AnnouncementsPanel />
        <CalendarPanel />
      </div>
    </div>
  );
}
