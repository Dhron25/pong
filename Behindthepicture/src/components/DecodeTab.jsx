import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Copy, Lock, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUpload from './FileUpload';
import { useSteganography } from '../context/SteganographyContext';

const DecodeTab = () => {
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedMessage, setExtractedMessage] = useState('');
  const { decodeImage, extractMessage } = useSteganography();

  const handleDecode = async () => {
    if (!decodeImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const message = await extractMessage(decodeImage, password);
      setExtractedMessage(message);
      toast.success('Message revealed! 🔍');
    } catch (error) {
      toast.error('Error: ' + error.message);
      setExtractedMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedMessage) return;
    
    try {
      await navigator.clipboard.writeText(extractedMessage);
      toast.success('Message copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Reveal Hidden Message</h2>
          <p className="text-white/70">Extract secret from steganography image</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <FileUpload type="decode" />

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <Lock className="w-5 h-5" />
            Password (If Used)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password if message was encrypted"
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handleDecode}
            disabled={isProcessing || !decodeImage}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Reveal Message
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Result Display */}
        {extractedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-white font-semibold">
              <MessageSquare className="w-5 h-5" />
              Hidden Message Found:
            </div>
            
            <div className="relative">
              <div className="p-4 bg-white/10 border border-white/20 rounded-xl text-white min-h-[100px] max-h-[200px] overflow-y-auto backdrop-blur-sm">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {extractedMessage}
                </pre>
              </div>
              
              <motion.button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 glass-button text-white/70 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center">
              <p className="text-green-300 font-semibold">
                ✅ Message successfully extracted!
              </p>
              <p className="text-green-300/70 text-sm mt-1">
                {extractedMessage.length} characters revealed
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DecodeTab;