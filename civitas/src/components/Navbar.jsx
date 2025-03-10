function Navbar() {
    return (
        <>
        {/* Header Section */}
      <header className="bg-[#FCF8F1] bg-opacity-30">
        <div className="px-4 mx-auto w-full sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 mt-2 lg:mt-3">
              <a href="#" className="flex items-center text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                Civitas
              </a>
            </div>
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
            >
              <svg
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>

            {/* Navbar Links */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
              <a href="#" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                Features
              </a>
              <a href="#" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                Solutions
              </a>
              <a href="#" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                Resources
              </a>
              <a href="#" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                Pricing
              </a>
            </div>

            {/* Join Button */}
            <a
              href="#"
              className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-black rounded-full"
              role="button"
            >
              Join Now
            </a>
          </div>
        </div>
      </header></>
    )
}
export default Navbar;