// src/components/EncodeTab.jsx

import React, { useState } from 'react';
import { useSteganography } from '../context/SteganographyContext';
import FileUpload from './FileUpload';
import { Lock, Eye, EyeOff, Download } from 'lucide-react';

const EncodeTab = () => {
  // Get all necessary state and functions from the context
  const {
    message,
    setMessage,
    password,
    setPassword,
    encryptionLevel,
    setEncryptionLevel,
    hideMessage,
    isProcessing,
    processedImage,
    resetState,
  } = useSteganography();

  const [showPassword, setShowPassword] = useState(false);

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'steganography_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      {/* File Upload Component */}
      <FileUpload />

      {/* Encryption Level */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">Encryption Level</label>
        <div className="flex gap-2">
          <button
            onClick={() => setEncryptionLevel('AES-256')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              encryptionLevel === 'AES-256'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
          >
            AES-256
          </button>
          <button
            onClick={() => setEncryptionLevel('RSA-2048')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              encryptionLevel === 'RSA-2048'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
          >
            RSA-2048
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">Secret Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your secret message..."
          className="w-full bg-gray-700 text-white border-gray-600 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
          maxLength="500"
        />
        <div className="text-right text-sm text-gray-400 mt-1">
          {message.length}/500 characters
        </div>
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter secure password..."
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
          onClick={hideMessage}
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
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Encrypt & Hide Message
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

      {/* Processed Image Result */}
      {processedImage && (
        <div className="mt-8">
            <h3 className="font-medium text-white mb-2">Encrypted Image</h3>
            <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg">
                <img
                    src={processedImage}
                    alt="Processed"
                    className="max-h-64 object-contain rounded-md"
                />
            </div>
            <button
                onClick={downloadImage}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors font-semibold"
            >
                <Download className="w-4 h-4" />
                Download Image
            </button>
        </div>
      )}
    </div>
  );
};

export default EncodeTab;