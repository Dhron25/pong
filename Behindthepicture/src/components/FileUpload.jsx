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