import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Students from "../assets/images/Students.png";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase"; // Use useNavigate instead of useHistory

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is authenticated:", user); // Debugging
        try {
          const idToken = await user.getIdToken(true); // Force refresh the token
          const response = await fetch("https://civitas-rc0z.onrender.com/login", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();
          console.log("Login success:", data);
          if (data.type === "NGO") {
            navigate("/dashboard/ngo");
          } else if (data.type === "Student") {
            navigate("/dashboard/stud");
          } else if (data.type === "Volunteer") {
            navigate("/dashboard/vol");
          } else {
            throw new Error("Unknown user type");
          }
          console.log("ID Token:", idToken); // Debugging
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        console.warn("No user is authenticated."); // Debugging
      }
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Check if the user is authenticated
      const user = userCredential.user;
      if (!user) {
        throw new Error("User authentication failed.");
      }

      console.log("User authenticated:", user); // Debugging

      // Get the ID token
      const idToken = await user.getIdToken(true); // Force refresh
      if (!idToken) {
        throw new Error("Failed to retrieve ID token.");
      }

      console.log("ID Token:", idToken); // Debugging
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavigation = (path) => {
    navigate(path); // Use navigate instead of history.push
  };

  return (
    <>
      <div className="min-h-screen bg-[#FCF8F1] flex items-center justify-center p-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="w-full md:w-1/2 max-w-xl">
            <img
              src={Students}
              alt="Students studying together"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? "Welcome back" : "Choose your role"}
                </h1>
                <p className="text-gray-600">
                  {isLogin
                    ? "Login to access your account"
                    : "Select how you want to enter the platform"}
                </p>
              </div>

              {isLogin ? (
                // Original Login Form
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-300 text-black py-3 px-4 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium"
                  >
                    <span>Log in</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                // Dropdown with Role Selection
                <div className="space-y-4">
                  <button
                    onClick={() => handleNavigation("/signup/student")}
                    className="w-full bg-yellow-300 text-black py-3 px-4 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium"
                  >
                    Enter as a Student →
                  </button>
                  <button
                    onClick={() => handleNavigation("/signup/volunteer")}
                    className="w-full bg-yellow-300 text-black py-3 px-4 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium"
                  >
                    Enter as a Volunteer →
                  </button>
                  <button
                    onClick={() => handleNavigation("/signup/ngo")}
                    className="w-full bg-yellow-300 text-black py-3 px-4 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 font-medium"
                  >
                    Enter as an NGO →
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin
                    ? "Don't have an account? Choose your role"
                    : "Already have an account? Log in"}
                </button>

                {/* Button to directly navigate to NGO Dashboard */}
                <button
                  onClick={() => navigate("/dashboard/ngo")}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to NGO Dashboard
                </button>
                <br />
                <button
                  onClick={() => navigate("/dashboard/vol")}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Volunteer Dashboard
                </button>
                <br />
                <button
                  onClick={() => navigate("/dashboard/stud")}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Student Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
