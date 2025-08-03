import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Search } from 'lucide-react';
import { useSteganography } from '../context/SteganographyContext';

const TabNavigation = () => {
  const { activeTab, setActiveTab } = useSteganography();

  const tabs = [
    { id: 'encode', label: 'Hide Message', icon: Lock },
    { id: 'decode', label: 'Extract Message', icon: Unlock },
    
    { id: 'detect', label: 'Detect Hidden Data (Beta)', icon: Search },
  ];

  return (
    <div className="border-b border-gray-700">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-4 px-6 font-medium transition-colors duration-200 flex items-center justify-center gap-2
                ${isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="underline"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;