import React, { useEffect, useState } from "react";
import RegistrationForm from "../components/Registration";

const StudentRegistration = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("https://civitas-iota.vercel.app/api/schools");
        if (!response.ok) {
          throw new Error("Failed to fetch schools");
        }
        const data = await response.json();
        setSchools(data.length > 0 ? data : []);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: "user", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "example@mail.com", icon: "mail", required: true },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "123-456-7890", icon: "user", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: "lock", required: true },
  ];

  const dropdowns = [
    {
      name: "school",
      label: "School",
      placeholder: loading ? "Loading schools..." : "Select your school",
      options: loading
        ? []
        : schools.length > 0
        ? schools.map((school) => ({ value: school.schoolId, label: school.schoolName }))
        : [{ value: "", label: "No schools found. Try again later" }],
      required: true,
    },
    {
      name: "grade",
      label: "Grade",
      placeholder: "Select your grade",
      options: Array.from({ length: 10 }, (_, i) => ({ value: `${i + 1}`, label: `Grade ${i + 1}` })),
      required: false,
    },
  ];

  return <RegistrationForm isStudent={true} fields={fields} isNotEnd={false} isFirst = {true} dropdowns={dropdowns} />;
};

export default StudentRegistration;