import React, { useState, useEffect } from 'react';

export const CustomSelectDeveloper = ({ options, selectedValue, onSelect }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleSelect = (option) => {
    onSelect(option?._id); // Pass _id to the parent callback
    setOpen(false); // Close the dropdown after selection
  };

  if (!options || options.length === 0) {
    return <div>Loading...</div>; // Handle loading or empty state
  }

  // Find the selected option
  const selectedOption = options.find((option) => option?._id === selectedValue);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        type="button"
        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-5 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue w-full text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Render selected option or placeholder */}
        <div className="flex items-center">
          {selectedOption ? (
            <>
              <img
                src={selectedOption.image}
                alt={selectedOption.name}
                className="h-6 w-6 rounded-full mr-2"
              />
              <span>{selectedOption.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Select an option</span>
          )}
        </div>
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 12a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 14.414l-2.293 2.293a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 12zm-3-2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0-4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul
            tabIndex="-1"
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-option-0"
            className="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
          >
            {options.map((option) => (
              <li
                key={option?._id}
                onClick={() => handleSelect(option)}
                className={`${
                  option?._id === selectedValue
                    ? 'text-white bg-indigo-600'
                    : 'text-gray-900'
                } cursor-default select-none relative py-2 pl-3 pr-9`}
              >
                <div className="flex items-center">
                  <img
                    src={option.image}
                    alt={option.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span
                    className={`${
                      option?._id === selectedValue
                        ? 'font-semibold'
                        : 'font-normal'
                    } block truncate`}
                  >
                    {option.name}
                  </span>
                </div>
                {option?._id === selectedValue && (
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-white"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 12a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 14.414l-2.293 2.293a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 12zm-3-2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0-4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
