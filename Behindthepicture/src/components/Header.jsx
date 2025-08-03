// src/components/Header.jsx

import React from 'react';


const NewLogo = () => (
  <div className="flex items-center gap-3">
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="10"/>
        <circle cx="50" cy="50" r="30" stroke="black" strokeWidth="10"/>
        <circle cx="50" cy="50" r="15" stroke="black" strokeWidth="10"/>
    </svg>
    <span className="text-2xl font-bold tracking-tight text-black">
      BehindthePicture
    </span>
  </div>
);

// Simplified Header for dark mode only
const Header = () => {
  return (
    <div className="bg-gray-800 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           {/* The HideBehindThePicture logo from the very first image */}
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center border-2 border-gray-700">
              <div className="w-6 h-6 border-2 border-gray-500 rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">
                HideBehindThePicture
              </h1>
            </div>
          </div>
        </div>
        {/* The light/dark mode toggle button has been removed */}
      </div>
       <p className="text-sm sm:text-lg text-gray-300 mt-2">
          End-to-end encrypted steganography with detection capabilities
        </p>
    </div>
  );
};

export default Header;