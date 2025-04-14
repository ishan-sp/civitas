import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function VerticalNavbar({ links = [] }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include", // Include cookies if needed
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      // Clear any local storage or authentication tokens if necessary
      localStorage.removeItem("token");

      // Redirect to the login page or home page
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[#FCF8F1] shadow-lg overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <RouterLink to="/" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
          Civitas
        </RouterLink>
      </div>

      {/* Navbar Links */}
      <nav className="flex flex-col items-start p-4 space-y-4">
        {links.map((link, index) => {
          if (link.scrollTo) {
            // Use react-scroll for scrolling links
            return (
              <ScrollLink
                key={index}
                to={link.scrollTo}
                smooth={true}
                duration={500}
                offset={-80} // Adjust offset to account for fixed navbar height
                className="w-full px-4 py-2 text-base text-black transition-all duration-200 rounded-lg hover:bg-yellow-300 hover:text-black focus:bg-yellow-300 focus:text-black cursor-pointer"
              >
                {link.name}
              </ScrollLink>
            );
          }
          // Use react-router-dom for navigation links
          return (
            <RouterLink
              key={index}
              to={link.href}
              className="w-full px-4 py-2 text-base text-black transition-all duration-200 rounded-lg hover:bg-yellow-300 hover:text-black focus:bg-yellow-300 focus:text-black"
            >
              {link.name}
            </RouterLink>
          );
        })}

        {/* Logout Link */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-base text-black transition-all duration-200 rounded-lg hover:bg-red-300 hover:text-black focus:bg-red-300 focus:text-black"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default VerticalNavbar;