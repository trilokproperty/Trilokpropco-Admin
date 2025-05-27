import React, { useState } from "react";

export const CustomSelectDeveloper = ({ options = [], selectedValue, onSelect }) => {
  const [open, setOpen] = useState(false);
  // console.log("optionsDeveloper", options);
  // console.log("selectedValueDeveloper", selectedValue);
  
  // console.log("optionsDeveloper", options);
  const toggleDropdown = () => setOpen(!open);

  const handleSelect = (option) => {
    onSelect(option?._id); // Pass _id to the parent callback
    setOpen(false); // Close dropdown after selection
  };
if (!options?.length) {
    return <div>Loading...</div>; // Handle loading state if options are empty
  }
  // Find the selected option
  const selectedOption = options.find((option) => option?._id === selectedValue);

  return (
    <div className="relative w-full">
      <div
        onClick={toggleDropdown}
        className={`cursor-pointer border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center ${
          open ? "shadow-lg" : "shadow-sm"
        } bg-white`}
      >
        <div className="flex items-center space-x-2">
          {selectedOption ? (
            <>
              <img
                src={selectedOption? selectedOption.image : ''}
                alt={selectedOption? selectedOption.name : ''}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-gray-700">{selectedOption? selectedOption.name : ''}</span>
            </>
          ) : (
            <span className="text-gray-500">Select a Developer</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {options.length > 0 ? (
            <ul className="max-h-56 overflow-auto py-1">
              {options.map((option) => (
                <li
                  key={option?._id}
                  onClick={() => handleSelect(option)}
                  className={`cursor-pointer flex items-center px-4 py-2 ${
                    option?._id === selectedValue
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={option.image}
                    alt={option.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="block truncate">{option.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500">No Developers Available</div>
          )}
        </div>
      )}
    </div>
  );
};
