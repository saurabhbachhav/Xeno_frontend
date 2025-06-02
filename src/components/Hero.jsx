"use client";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Hero Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Welcome to&nbsp;
          <span className="text-teal-600">Xeno</span>
          <span className="text-gray-800">_minCRM</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
          Manage your campaigns effortlessly with intuitive tools, real-time
          analytics, and a sleek interface. Get started today and take control
          of your marketing!
        </p>
        <button className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold px-8 py-3 rounded-full transition-shadow shadow-md hover:shadow-lg">
          Get Started
        </button>
      </div>
    </section>
  );
}
