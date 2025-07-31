import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'encode', label: 'Hide Message', icon: EyeOff },
    { id: 'decode', label: 'Reveal Message', icon: Eye },
  ];

  return (
    <div className="glass-card p-2 mb-8">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;