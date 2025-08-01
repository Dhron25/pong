import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useSteganography } from '../context/SteganographyContext';

const FileUpload = ({ type }) => {
  const fileInputRef = useRef(null);
  const { encodeImage, decodeImage, setEncodeImage, setDecodeImage } = useSteganography();
  
  const currentImage = type === 'encode' ? encodeImage : decodeImage;
  const setCurrentImage = type === 'encode' ? setEncodeImage : setDecodeImage;

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setCurrentImage({
          data: imageData,
          preview: e.target.result,
          name: file.name,
          size: file.size
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-white font-semibold">
        <ImageIcon className="w-5 h-5" />
        Select Image
      </label>
      
      <AnimatePresence mode="wait">
        {!currentImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="upload-zone p-8 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 bg-white/10 rounded-full">
                <Upload className="w-8 h-8 text-white/70" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-white/60 text-sm">
                  Supports PNG, JPG, BMP • Max 10MB
                </p>
              </div>
            </motion.div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass-card p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={currentImage.preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-white/20"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">
                  {currentImage.name}
                </h4>
                <p className="text-white/60 text-sm">
                  {formatFileSize(currentImage.size)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-sm">Ready to process</span>
                </div>
              </div>
              
              <motion.button
                onClick={() => setCurrentImage(null)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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