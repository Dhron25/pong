// src/components/DecodeTab.jsx

import React, { useState } from 'react';
import { useSteganography } from '../context/SteganographyContext';
import FileUpload from './FileUpload';
import { Unlock, Eye, EyeOff, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const DecodeTab = () => {
  const {
    password,
    setPassword,
    extractMessage,
    isProcessing,
    extractedMessage,
    resetState
  } = useSteganography();

  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = async () => {
    if (!extractedMessage) return;
    try {
      await navigator.clipboard.writeText(extractedMessage);
      // We can use a proper status message later
      alert('Message copied to clipboard!');
    } catch (error) {
      alert('Failed to copy message.');
    }
  };

  return (
    <div>
      {/* File Upload Component */}
      <FileUpload />

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password used for encryption..."
            className="w-full bg-gray-700 text-white border-gray-600 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={extractMessage}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3
            ${isProcessing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Unlock className="w-5 h-5" />
              Extract & Decrypt Message
            </>
          )}
        </button>
        <button
          onClick={resetState}
          className="w-full py-3 px-6 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
        >
          Reset
        </button>
      </div>

      {/* Extracted Message Result */}
      {extractedMessage && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
        >
          <h3 className="font-medium text-white mb-2">Decrypted Message</h3>
          <div className="relative bg-gray-900/50 p-4 rounded-lg border border-gray-600">
            <pre className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{extractedMessage}</pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DecodeTab;