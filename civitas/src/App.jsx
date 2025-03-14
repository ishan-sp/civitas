import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login"; // Restore the Login route
import StudentRegistration from "./routes/studentSignupRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Student Registration Route */}
        <Route path="/signup/student" element={<StudentRegistration />} />
      </Routes>
    </Router>
  );
};

export default App;