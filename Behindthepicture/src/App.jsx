import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import EncodeTab from './components/EncodeTab';
import DecodeTab from './components/DecodeTab';
import { SteganographyProvider } from './context/SteganographyContext';

function App() {
  const [activeTab, setActiveTab] = useState('encode');

  return (
    <SteganographyProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Header />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'encode' ? <EncodeTab /> : <DecodeTab />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
            },
          }}
        />
      </div>
    </SteganographyProvider>
  );
}

export default App;