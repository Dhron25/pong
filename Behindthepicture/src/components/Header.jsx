// src/components/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const HideLogo = () => (
  <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg shadow-lg">
    <div className="relative">
      <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
      <div className="absolute top-1 left-1 w-4 h-4 bg-gray-800 rounded"></div>
    </div>
  </div>
);

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-8 py-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HideLogo />
          <div>
            <h1 className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              HideBehindThePicture
            </h1>
            <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              End-to-end encrypted steganography with detection capabilities
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </motion.button>
      </div>
    </div>
  );
};

export default Header;