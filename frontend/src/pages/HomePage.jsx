import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/features/HeroSection';
import SearchBar from '../components/features/SearchBar';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="Empower Inclusive Education"
          subtitle="Accessible tool for evaluating educational assistive technologies. Helping educators and administrators make informed decisions for inclusive learning environments."
          primaryButtonText="Explore Technologies"
          primaryButtonLink="/technologies"
        />

        {/* Search Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Search Assistive Technologies</h2>
            <SearchBar placeholder="Search assistive technologies..." />
          </div>
        </section>

        {/* Data-Driven Insights Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Data-Driven Insights</h2>
            <p className="mt-4 text-lg text-gray-600">
              Make informed decisions with comprehensive data and insights.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900">Comprehensive Data</h3>
                <p className="mt-2 text-gray-600">Access detailed information on assistive technologies.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900">User Reviews</h3>
                <p className="mt-2 text-gray-600">Real feedback from educators and specialists.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900">Comparison Tools</h3>
                <p className="mt-2 text-gray-600">Compare features, pricing, and ratings easily.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;