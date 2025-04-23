import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">EduAbility</div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
          </li>
          <li>
            <Link to="/technologies" className="text-gray-600 hover:text-blue-600 font-medium">Technologies</Link>
          </li>
          <li>
            <Link to="/compare" className="text-gray-600 hover:text-blue-600 font-medium">Compare</Link>
          </li>
          <li>
            <Link to="/feedback" className="text-gray-600 hover:text-blue-600 font-medium">Feedback</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;