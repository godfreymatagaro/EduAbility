import React from 'react';

const SearchBar = ({ placeholder }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        aria-label="Search assistive technologies"
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        aria-label="Submit search"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;