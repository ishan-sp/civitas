import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login"; // Restore the Login route
import StudentRegistration from "./routes/studentSignupRoute";
import Navbar from "./components/Navbar";
import VolunteerRegistration from "./routes/volunteerSignupRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Route */}
        <Route path="/login" element={<><Navbar links={[
  { name: "About us", href: "/about" },
  { name: "FAQ", href: "/faq" },
]} /><Login /></>} />

        {/* Student Registration Route */}
        <Route path="/signup/student" element={<><Navbar links={[
  { name: "About us", href: "/about" },
  { name: "FAQ", href: "/faq" },
]}/><StudentRegistration /></>} />
        <Route path="/signup/volunteer" element={<><Navbar links={[
  { name: "About us", href: "/about" },
  { name: "FAQ", href: "/faq" },
]}/><VolunteerRegistration /></>} />
      </Routes>
    </Router>
  );
};

export default App;