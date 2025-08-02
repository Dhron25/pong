// src/App.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import EncodeTab from './components/EncodeTab';
import DecodeTab from './components/DecodeTab';
import { SteganographyProvider, useSteganography } from './context/SteganographyContext';
// We'll create this file in a later step, for now, it's just a placeholder.
// To prevent an error, let's create a temporary one.
const DetectHiddenDataTab = () => <div className="text-white">Detection Tab Coming Soon...</div>;

const AppContent = () => {
  // Now using the context for activeTab state
  const { activeTab } = useSteganography();

  return (
    <>
      <TabNavigation />
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'encode' && <EncodeTab />}
            {activeTab === 'decode' && <DecodeTab />}
            {/* Add the new tab to the rendering logic */}
            {activeTab === 'detect' && <DetectHiddenDataTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SteganographyProvider>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-200'} transition-all duration-300`}>
        <div className="max-w-6xl mx-auto">
          {/* Header no longer needs activeTab props */}
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <main className={`mt-8 mx-4 lg:mx-0 rounded-lg shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <AppContent />
          </main>
        </div>
      </div>
    </SteganographyProvider>
  );
}

export default App;