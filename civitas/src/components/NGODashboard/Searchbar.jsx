import React, { useState } from "react";

const SearchBar = ({ data, filterKey, onResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const input = e.target.value;
    setQuery(input);

    // Perform semantic analysis and filtering
    const normalizedQuery = input.toLowerCase().trim();
    const filteredResults = data.filter((item) =>
      item[filterKey].toLowerCase().includes(normalizedQuery)
    );

    // Return filtered results to the parent component
    onResults(filteredResults);
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-3/4 max-w-lg">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search schools by name or location..."
          className="w-full px-4 py-4 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2v6m0-6a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;