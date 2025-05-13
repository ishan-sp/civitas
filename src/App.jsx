import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import StudentRegistration from "./routes/studentSignupRoute";
import VolunteerRegistration from "./routes/volunteerSignupRoute";
import NgoRegistration from "./routes/ngoSignupRoute";
import Navbar from "./components/Navbar";
import NGODash from "./components/NGODashboard/NGODash";
import VOLDash from "./components/VolunteerDashboard/VOLDash";
import StudDash from "./components/StudentDashboard/StudDash";
import SchoolManagement from "./components/VolunteerDashboard/SchoolManage/SchoolManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<><Navbar links={[{ name: "About us", href: "/about" }, { name: "FAQ", href: "/faq" }]} /><Login /></>} />
        <Route path="/signup/student" element={<><Navbar links={[{ name: "About us", href: "/about" }, { name: "FAQs", href: "/faq" }]} /><StudentRegistration /></>} />
        <Route path="/signup/volunteer" element={<><Navbar links={[{ name: "About us", href: "/about" }, { name: "FAQs", href: "/faq" }]} /><VolunteerRegistration /></>} />
        <Route path="/signup/ngo" element={<><Navbar links={[{ name: "About us", href: "/about" }, { name: "FAQs", href: "/faq" }]} /><NgoRegistration /></>} />
        <Route path="/dashboard/ngo/*" element={<NGODash />} />
        <Route path="/dashboard/vol/*" element={<VOLDash />} />
        <Route path="/dashboard/stud/*" element={<StudDash />} />
        <Route path = "/school-management*" element = {<SchoolManagement />} />
        
      </Routes>
    </Router>
  );
};

export default App;