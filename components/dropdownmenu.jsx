import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options, buttonText, menuoption1, menuoption2, menuoption3, menuoption4, menuoption5, menuoption6 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div  className="grid grid-cols-1 justify-between">
  <div>
  <button ref={dropdownRef} type="button" 
          className="font text-center justify-center text-white inline-flex w-full bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 px-3 py-2.5 rounded-lg text-sm" 
          id="menu-button" 
          aria-expanded={isOpen} 
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
      {buttonText}
      <svg className="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  {isOpen && (
  <div className="font absolute mt-10 w-40 border-2 border-green-700 origin-top-right divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
    <div className="py-1" role="none">
     
      <p href="#" className="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-400 rounded" role="menuitem" tabindex="-1" id="menu-item-1">{menuoption1}</p>
      <p href="#" class="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-400" role="menuitem" tabindex="-1" id="menu-item-2">{menuoption2}</p>
    </div>
    <div class="py-1" role="none">
      <p href="#" className="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-400" role="menuitem" tabindex="-1" id="menu-item-3">{menuoption3}</p>
      <p href="#" className="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-400" role="menuitem" tabindex="-1" id="menu-item-4">{menuoption4}</p>
    </div>
    <div class="py-1" role="none">
      <p href="#" className="cursor-pointertext-gray-700 block px-4 py-2 text-sm hover:bg-gray-400" role="menuitem" tabindex="-1" id="menu-item-5">{menuoption5}</p>
      <p href="#" className="cursor-pointertext-gray-700 block px-4 py-2 text-sm hover:bg-gray-400" role="menuitem" tabindex="-1" id="menu-item-6">{menuoption6}</p>
    </div>
  </div>
  )}
</div>

  );
};

export default Dropdown;
