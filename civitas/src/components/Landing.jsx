import Navbar from "./Navbar";
import { Link } from 'react-router-dom';

function Landing() {
    return (
        <>
        <Navbar links={[{ name: "About us", href: "/about-us" }, { name: "FAQs", href: "/faqs" }]} />
        <section className="bg-[#FCF8F1] bg-opacity-30 min-h-screen flex items-center">
        <div className="px-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Side - Text Content */}
            <div>
              <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">
                A platform for everyone
              </p>
              <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl">
                Connect & learn from the experts
              </h1>
              <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
                Volunteers and experts from around the world are here to help you learn and grow. Join us now and
              </p>

              {/* CTA Button */}
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
                role="button"
              >
                Join now
                <svg
                  className="w-6 h-6 ml-8 -mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>

              {/* Login Link */}
              <p className="mt-5 text-gray-600">
                Already joined us?{" "}
                <Link to="/login" className="text-black transition-all duration-200 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            {/* Right Side - Image */}
            <div>
              <img
                className="w-full"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
                alt="Hero"
              />
            </div>
          </div>
        </div>
      </section></>
    )
}
export default Landing;