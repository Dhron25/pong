import React, { createContext, useContext, useState, useRef } from 'react';

const SteganographyContext = createContext();

// Custom hook to use the context easily in other components
export const useSteganography = () => useContext(SteganographyContext);

// --- Helper functions (logic extracted from SteganographyTool.jsx) ---

// Enhanced hash function
const hashPassword = (password) => {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) + password.charCodeAt(i);
  }
  return Math.abs(hash);
};

// Pseudo-random number generator with seed
const createRNG = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
    return state / Math.pow(2, 32);
  };
};

// Convert string to binary
const stringToBinary = (str) => {
  return str.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
};

// Convert binary to string
const binaryToString = (binary) => {
  const bytes = binary.match(/.{8}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
};

// AES-like encryption (simplified for demonstration)
const simpleAESEncrypt = (text, key) => {
  const keyHash = hashPassword(key);
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = keyHash % 256;
    encrypted += String.fromCharCode(charCode ^ keyChar ^ (i % 255));
  }
  return btoa(encrypted); // Base64 encode
};

const simpleAESDecrypt = (encryptedText, key) => {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    const keyHash = hashPassword(key);
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = keyHash % 256;
      decrypted += String.fromCharCode(charCode ^ keyChar ^ (i % 255));
    }
    return decrypted;
  } catch {
    return null;
  }
};

// RSA-like encryption (simplified)
const simpleRSAEncrypt = (text, key) => {
  const keyNum = hashPassword(key) % 1000 + 100;
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const encryptedChar = (charCode * keyNum) % 65536;
    encrypted += encryptedChar.toString(16).padStart(4, '0');
  }
  return encrypted;
};

const simpleRSADecrypt = (encryptedText, key) => {
  try {
    const keyNum = hashPassword(key) % 1000 + 100;
    let decrypted = '';
    for (let i = 0; i < encryptedText.length; i += 4) {
      const hexChar = encryptedText.substr(i, 4);
      const encryptedChar = parseInt(hexChar, 16);
      for (let j = 0; j < 256; j++) {
        if ((j * keyNum) % 65536 === encryptedChar) {
          decrypted += String.fromCharCode(j);
          break;
        }
      }
    }
    return decrypted;
  } catch {
    return null;
  }
};

const calculateVariance = (values) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return variance;
};


// --- The Provider Component ---
export const SteganographyProvider = ({ children }) => {
  // State variables
  const [activeTab, setActiveTab] = useState('encode');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [originalImage, setOriginalImage] = useState(null); // Stores URL from FileReader
  const [processedImage, setProcessedImage] = useState(null); // Stores URL from canvas.toBlob
  const [extractedMessage, setExtractedMessage] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState('AES-256'); // Updated to match UI
  const [detectionResults, setDetectionResults] = useState(null);
  
  const canvasRef = useRef(null);

  const resetState = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setMessage('');
    setPassword('');
    setExtractedMessage('');
    setDetectionResults(null);
    setStatus({ type: '', message: '' });
  };
  
  const hideMessage = async () => {
    // ... Implementation of hideMessage logic will go here in a future commit ...
    console.log("hideMessage called");
    // This will be filled in Step 6
  };
  
  const extractMessage = async () => {
    // ... Implementation of extractMessage logic will go here in a future commit ...
    console.log("extractMessage called");
    // This will be filled in Step 7
  };

  const detectHiddenData = async () => {
    // ... Implementation of detectHiddenData logic will go here in a future commit ...
    console.log("detectHiddenData called");
    // This will be filled in Step 8
  };

  // The value that will be available to all consumer components
  const value = {
    activeTab, 
    setActiveTab,
    message,
    setMessage,
    password,
    setPassword,
    originalImage,
    setOriginalImage,
    processedImage,
    setProcessedImage,
    extractedMessage,
    setExtractedMessage,
    status,
    setStatus,
    isProcessing,
    setIsProcessing,
    encryptionLevel,
    setEncryptionLevel,
    detectionResults,
    setDetectionResults,
    canvasRef,
    hideMessage,
    extractMessage,
    detectHiddenData,
    resetState
  };

  return (
    <SteganographyContext.Provider value={value}>
      {children}
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </SteganographyContext.Provider>
  );
};