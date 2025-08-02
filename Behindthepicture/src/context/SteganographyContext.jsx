import React, { createContext, useContext, useState, useRef } from 'react';

const SteganographyContext = createContext();


export const useSteganography = () => useContext(SteganographyContext);


const hashPassword = (password) => {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) + password.charCodeAt(i);
  }
  return Math.abs(hash);
};

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
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [extractedMessage, setExtractedMessage] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState('AES-256');
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
    if (!originalImage || !message.trim() || !password.trim()) {
      setStatus({ type: 'error', message: 'Please provide an image, message, and password.' });
      return;
    }
    if (message.length > 500) {
      setStatus({ type: 'error', message: 'Message too long. Maximum 500 characters.' });
      return;
    }

    setIsProcessing(true);
    setStatus({ type: '', message: '' });
    setProcessedImage(null);

    try {
      const currentEncryptionLevel = encryptionLevel.split('-')[0]; // 'AES' or 'RSA'
      let encryptedMessage;
      if (currentEncryptionLevel === 'AES') {
        encryptedMessage = simpleAESEncrypt(message, password);
      } else {
        encryptedMessage = simpleRSAEncrypt(message, password);
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const fullMessage = `${currentEncryptionLevel}:${encryptedMessage}|||END|||`;
        const binaryMessage = stringToBinary(fullMessage);
        
        const availablePixels = (data.length / 4) * 3;
        if (binaryMessage.length > availablePixels) {
          setStatus({ type: 'error', message: 'Image too small for this message.' });
          setIsProcessing(false);
          return;
        }

        const seed = hashPassword(password);
        const rng = createRNG(seed);
        
        const positions = [];
        const totalPixels = data.length / 4;
        
        for (let i = 0; i < binaryMessage.length; i++) {
          let pixelIndex, channelIndex;
          do {
            pixelIndex = Math.floor(rng() * totalPixels);
            channelIndex = Math.floor(rng() * 3);
          } while (positions.some(pos => pos.pixel === pixelIndex && pos.channel === channelIndex));
          
          positions.push({ pixel: pixelIndex, channel: channelIndex });
        }

        for (let i = 0; i < binaryMessage.length; i++) {
          const pos = positions[i];
          const dataIndex = pos.pixel * 4 + pos.channel;
          const bit = parseInt(binaryMessage[i]);
          data[dataIndex] = (data[dataIndex] & 0xFE) | bit;
        }

        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setProcessedImage(url);
          setStatus({ 
            type: 'success', 
            message: `Message encrypted with ${encryptionLevel} and hidden successfully!` 
          });
          setIsProcessing(false);
        }, 'image/png');
      };
      
      img.src = originalImage.url;
    } catch (error) {
      setStatus({ type: 'error', message: 'Error processing image: ' + error.message });
      setIsProcessing(false);
    }
  };
  
  const extractMessage = async () => {
    if (!originalImage || !password.trim()) {
      setStatus({ type: 'error', message: 'Please provide an image and password.' });
      return;
    }

    setIsProcessing(true);
    setStatus({ type: '', message: '' });
    setExtractedMessage('');

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const seed = hashPassword(password);
        
        let binaryMessage = '';
        let foundEnd = false;
        const totalPixels = data.length / 4;
        
        const maxBitsToRead = 500 * 8 * 2;
        const checkedPositions = new Set();
        const rng = createRNG(seed);

        for (let i = 0; i < maxBitsToRead && !foundEnd; i++) {
          let pixelIndex, channelIndex, posKey;
          
          do {
            pixelIndex = Math.floor(rng() * totalPixels);
            channelIndex = Math.floor(rng() * 3);
            posKey = `${pixelIndex}-${channelIndex}`;
          } while (checkedPositions.has(posKey));
          checkedPositions.add(posKey);
          
          const dataIndex = pixelIndex * 4 + channelIndex;
          const bit = data[dataIndex] & 1;
          binaryMessage += bit;
          
          if (binaryMessage.length >= 64 && binaryMessage.length % 8 === 0) {
            const currentMessage = binaryToString(binaryMessage);
            if (currentMessage.includes('|||END|||')) {
              foundEnd = true;
              const encryptedData = currentMessage.split('|||END|||')[0];
              
              const colonIndex = encryptedData.indexOf(':');
              if (colonIndex === -1) {
                setStatus({ type: 'error', message: 'Invalid message format found.' });
                setIsProcessing(false);
                return;
              }
              
              const encType = encryptedData.substring(0, colonIndex);
              const encryptedMsg = encryptedData.substring(colonIndex + 1);
              
              let decryptedMessage;
              if (encType === 'AES') {
                decryptedMessage = simpleAESDecrypt(encryptedMsg, password);
              } else if (encType === 'RSA') {
                decryptedMessage = simpleRSADecrypt(encryptedMsg, password);
              }
              
              if (decryptedMessage) {
                setExtractedMessage(decryptedMessage);
                setStatus({ 
                  type: 'success', 
                  message: `Message decrypted successfully using ${encType}!` 
                });
              } else {
                setStatus({ type: 'error', message: 'Decryption failed. Check your password.' });
              }
            }
          }
        }

        if (!foundEnd) {
          setStatus({ type: 'error', message: 'No hidden message found or password incorrect.' });
        }
        
        setIsProcessing(false);
      };
      
      img.src = originalImage.url;
    } catch (error) {
      setStatus({ type: 'error', message: 'Error processing image: ' + error.message });
      setIsProcessing(false);
    }
  };

  const detectHiddenData = async () => {
    // This will be implemented in the next step
    console.log("detectHiddenData called");
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
      {}
      <canvas ref={canvasRef} className="hidden" />
    </SteganographyContext.Provider>
  );
};