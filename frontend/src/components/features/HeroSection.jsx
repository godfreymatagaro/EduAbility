import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ title, subtitle, primaryButtonText, primaryButtonLink }) => {
  return (
    <section className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl mb-8">{subtitle}</p>
        <Link
          to={primaryButtonLink}
          className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition"
        >
          {primaryButtonText}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;