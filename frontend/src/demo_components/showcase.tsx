// Showcase.tsx

import React from 'react';

export const Showcase: React.FC = () => {
  return (
    <section
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/showcase-background.jpg')" }}
      id="showcase"
    >
      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Foreground Image */}
        <div className="w-3/4 max-w-md mb-6">
          <img
            src="/images/showcase-foreground.png" // Replace with your image path
            alt="Showcase Image"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Optional Heading and Description */}
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Bluenotes in Action
        </h2>
        <p className="text-lg text-purple-200 mb-8">
          Explore how Bluenotes can transform your trading experience with our comprehensive tools and features.
        </p>

        {/* Optional Call-to-Action Button */}
        <button
          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => window.location.href="#features"}
        >
          Learn More
        </button>
      </div>
    </section>
  );
};
