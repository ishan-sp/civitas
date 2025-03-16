import ngoDashboardHero from "../../assets/images/ngoDashboardHero.jpg";

function NgoHeroSection() {
  return (
    <section className="bg-[#FCF8F1] pt-16 h-[50vh] flex items-center">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl leading-tight">
            Together We Can <span className="text-yellow-500">Make a Difference</span>
          </h1>
          <p className="mt-4 text-base text-gray-700 sm:text-lg lg:text-xl">
            Join us in our mission to help children in need by providing an accessible platform for them to reach you. Get connected with volunteers and expand your presence.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="lg:w-1/3">
          <img
            className="w-full rounded-xl shadow-md"
            src={ngoDashboardHero}
            alt="Children learning in school"
          />
        </div>
      </div>
    </section>
  );
}

export default NgoHeroSection;