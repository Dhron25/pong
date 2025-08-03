import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useSteganography } from '../context/SteganographyContext';
// STEP 1: Import the new conversion library
import heic2any from 'heic2any';

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // ADDED: A new state to give user feedback during conversion
  const [isConverting, setIsConverting] = useState(false);
  
  const {
    originalImage,
    setOriginalImage,
    setProcessedImage,
    setExtractedMessage,
    setDetectionResults,
    setStatus,
    resetState,
    getExifData
  } = useSteganography();

  // This is the original logic, now moved into its own function
  const processFile = (file) => {
    getExifData(file); // Get metadata
    const reader = new FileReader();
    reader.onload = (e) => {
      setProcessedImage(null);
      setExtractedMessage('');
      setDetectionResults(null);
      setStatus({ type: '', message: '' });
      setOriginalImage({
          url: e.target.result,
          name: file.name,
          size: file.size
      });
    };
    reader.readAsDataURL(file);
  };

  // UPDATED: This function is now the main entry point for file handling
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Check if the file is HEIC/HEIF
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      setIsConverting(true);
      setStatus({ type: 'info', message: 'Converting HEIC image...' });
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });
        // Create a new File object from the converted blob
        const convertedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpeg'), { type: convertedBlob.type });
        processFile(convertedFile); // Process the newly converted JPEG
      } catch (error) {
        console.error("HEIC Conversion Error:", error);
        setStatus({ type: 'error', message: 'Failed to convert HEIC image.' });
      } finally {
        setIsConverting(false);
      }
    } else if (file.type.startsWith('image/')) {
      // If it's a standard image, process it directly
      processFile(file);
    } else {
      setStatus({ type: 'error', message: 'Please select a valid image file (JPG, PNG, WebP, HEIC).' });
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files[0]; handleFileSelect(file); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };

  const formatFileSize = (bytes) => { /* ... function remains the same ... */ };

  return (
    <div className="mb-6">
      <label className="block text-white font-medium mb-3">Select Image</label>
      <AnimatePresence mode="wait">
        {!originalImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative w-full py-6 px-6 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer ${isDragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-500 hover:border-blue-400 hover:bg-gray-700/50'}`}
            onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            onClick={() => !isConverting && fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-gray-300" />
            <span className="text-gray-200">
              {/* Show converting status to user */}
              {isConverting ? 'Converting...' : 'Upload Image or Drop Here'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              // ADDED: Allow HEIC/HEIF files to be selected
              accept="image/jpeg, image/png, image/webp, .heic, .heif"
              disabled={isConverting}
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            /* ... motion props remain the same ... */
            className="relative bg-gray-700/50 p-4 rounded-lg border border-gray-600"
          >
            <div className="flex items-start gap-4">
              <img src={originalImage.url} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-gray-500" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">{originalImage.name}</h4>
                <p className="text-gray-400 text-sm">{formatFileSize(originalImage.size)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm">Ready to process</span>
                </div>
              </div>
              <motion.button
                onClick={() => {
                  resetState();
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;