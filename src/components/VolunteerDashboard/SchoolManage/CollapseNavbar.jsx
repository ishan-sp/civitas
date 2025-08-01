import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaHome, FaUsers, FaCog, FaSignOutAlt, FaUniversity } from "react-icons/fa";

function CollapseNavbar({ links = [], collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      if (user) {
        const idToken = await user.getIdToken();

        try {
          const response = await fetch("https://civitas-rc0z.onrender.com/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn("Backend logout failed (continuing anyway)");
          }
        } catch (fetchErr) {
          console.warn("Logout fetch error:", fetchErr);
        }
      }

      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } bg-[#FCF8F1] shadow-lg z-20`} // Increased z-index to avoid overlap issues
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <RouterLink
          to="/"
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 flex items-center justify-center"
        >
          {collapsed ? (
            <FaUniversity className="text-3xl" />
          ) : (
            "Civitas"
          )}
        </RouterLink>
      </div>

      {/* Navbar Links */}
      <nav className="flex flex-col items-start p-4 space-y-4">
        {links.map((link, index) => {
          const icon = link.icon || <FaHome />;
          const text = collapsed ? "" : link.name;

          if (link.scrollTo) {
            return (
              <ScrollLink
                key={index}
                to={link.scrollTo}
                smooth={true}
                duration={500}
                offset={-80}
                className={`w-full flex items-center px-4 py-2 text-base text-gray-800 transition-all duration-200 rounded-lg hover:bg-yellow-300 hover:text-black ${
                  collapsed ? "justify-center" : "justify-start"
                }`}
              >
                <div className="text-xl">{icon}</div>
                <span className={`${collapsed ? "hidden" : ""} ml-4`}>{text}</span>
              </ScrollLink>
            );
          }

          return (
            <RouterLink
              key={index}
              to={link.href}
              className={`w-full flex items-center px-4 py-2 text-base text-gray-800 transition-all duration-200 rounded-lg hover:bg-yellow-300 hover:text-black ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <div className="text-xl">{icon}</div>
              <span className={`${collapsed ? "hidden" : ""} ml-4`}>{text}</span>
            </RouterLink>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-base text-red-600 transition-all duration-200 rounded-lg hover:bg-red-300 hover:text-black justify-center"
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`${collapsed ? "hidden" : ""} ml-4`}>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default CollapseNavbar;
