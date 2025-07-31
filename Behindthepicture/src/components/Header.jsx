import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <motion.div
        className="flex items-center justify-center mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative">
          <Shield className="w-16 h-16 text-purple-400 animate-bounce-gentle" />
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Lock className="w-6 h-6 text-pink-400" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-4 gradient-text"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Steganography Studio
      </motion.h1>
      
      <motion.p
        className="text-xl text-white/80 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Hide secrets in plain sight • Advanced image steganography
      </motion.p>
      
      <motion.div
        className="flex items-center justify-center gap-4 mt-6 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Client-side</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Zero-knowledge</span>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;