// src/App.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import EncodeTab from './components/EncodeTab';
import DecodeTab from './components/DecodeTab';
import DetectHiddenDataTab from './components/DetectHiddenDataTab';
import { SteganographyProvider, useSteganography } from './context/SteganographyContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const AppContent = () => {
  const { activeTab, status } = useSteganography();

  return (
    <>
      <TabNavigation />
      <div className="p-8">
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
  // All darkMode state has been removed.
  return (
    <SteganographyProvider>
      {/* The main div no longer needs background classes, as it's handled by index.css */}
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto pb-12">
          {/* No more props passed to Header */}
          <Header />
          {/* Main container is now permanently dark */}
          <main className="mt-8 mx-4 lg:mx-0 rounded-lg shadow-2xl overflow-hidden bg-gray-800">
             <AppContent />
          </main>
        </div>
      </div>
    </SteganographyProvider>
  );
}

export default App;