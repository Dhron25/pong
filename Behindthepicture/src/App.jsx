import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import EncodeTab from './components/EncodeTab';
import DecodeTab from './components/DecodeTab';
import DetectHiddenDataTab from './components/DetectHiddenDataTab';
import { SteganographyProvider, useSteganography } from './context/SteganographyContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// This component now also handles displaying status messages from the context.
const AppContent = () => {
  const { activeTab, status } = useSteganography();

  return (
    <>
      <TabNavigation />
      <div className="p-8">
        {/* Status Messages */}
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
              status.type === 'success' 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {status.message}
          </motion.div>
        )}

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
        <div className="max-w-6xl mx-auto pb-12">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <main className={`mt-8 mx-4 lg:mx-0 rounded-lg shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <AppContent />
          </main>
        </div>
      </div>
    </SteganographyProvider>
  );
}

export default App;