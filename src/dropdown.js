import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Dropdown = ({items,title}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const handleMouseEnter = () => {
      setIsDropdownOpen(true);
    };
  
    const handleMouseLeave = (e) => {
      // Check if the relatedTarget is not null and is not a descendant of .relative.group
      if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('.relative.group')) {
        setIsDropdownOpen(false);
      }
    };

    const handleClick = (e) => {
        setIsDropdownOpen(false);
    }
  
    return (
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="text-gray-800 hover:text-gray-600 focus:outline-none px-4"
        >
          {title}
        </button>
        <div
          className={`${
            isDropdownOpen ? 'block' : 'hidden'
          } absolute bg-gray-200 border w-[30vh] border-gray-300 text-gray-800 rounded-md mt-0 space-y-2 px-4 py-2`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <Link
                to={item.to}
                onClick={handleClick}
                className="block hover:bg-gray-300 px-4 py-2 rounded-md"
              >
                {item.label}
              </Link>
              {index < items.length - 1 && <hr className="border-gray-300 my-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
};
export default Dropdown;