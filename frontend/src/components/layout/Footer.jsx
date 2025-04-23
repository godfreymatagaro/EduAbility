import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="mt-2 text-gray-300">
              Making assistive technology accessible to all educators and learners.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/technologies" className="text-gray-300 hover:text-white">Technologies</Link></li>
              <li><Link to="/compare" className="text-gray-300 hover:text-white">Compare</Link></li>
              <li><Link to="/resources" className="text-gray-300 hover:text-white">Resources</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Connect</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          &copy; 2025 EduAbility. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;