import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Lock, Type, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUpload from './FileUpload';
import { useSteganography } from '../context/SteganographyContext';

const EncodeTab = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { encodeImage, resultImage, hideMessage } = useSteganography();

  const handleEncode = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message to hide');
      return;
    }
    
    if (!encodeImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    
    try {
      await hideMessage(encodeImage, message, password);
      toast.success('Message hidden successfully! 🎉');
    } catch (error) {
      toast.error('Error hiding message: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = resultImage.width;
    canvas.height = resultImage.height;
    ctx.putImageData(resultImage, 0, 0);
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'steganography-image.png';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image downloaded! 📥');
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <EyeOff className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Hide Your Secret</h2>
          <p className="text-white/70">Embed a message into an image</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <FileUpload type="encode" />

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <Type className="w-5 h-5" />
            Secret Message
          </label>
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message here..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none h-32 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              maxLength={1000}
            />
            <div className="absolute bottom-3 right-3 text-white/50 text-sm">
              {message.length}/1000
            </div>
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <Lock className="w-5 h-5" />
            Password (Optional)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Add password for extra security"
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleEncode}
            disabled={isProcessing || !message.trim() || !encodeImage}
            className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <EyeOff className="w-5 h-5" />
                Hide Message
              </>
            )}
          </motion.button>

          {resultImage && (
            <motion.button
              onClick={handleDownload}
              className="flex items-center justify-center gap-3 py-4 px-6 glass-button text-white font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Download className="w-5 h-5" />
              Download
            </motion.button>
          )}
        </motion.div>

        {/* Success Message */}
        {resultImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center"
          >
            <p className="text-green-300 font-semibold">
              ✅ Message successfully hidden in the image!
            </p>
            <p className="text-green-300/70 text-sm mt-1">
              Download the image and share it securely
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EncodeTab;