// src/components/DetectHiddenDataTab.jsx

import React from 'react';
import { useSteganography } from '../context/SteganographyContext';
import FileUpload from './FileUpload';
import { Search, FileImage } from 'lucide-react';
import { motion } from 'framer-motion';

const DetectHiddenDataTab = () => {
  const {
    originalImage,
    isProcessing,
    detectHiddenData,
    detectionResults,
    resetState
  } = useSteganography();
  
  const getLikelihoodColor = (likelihood) => {
    switch (likelihood) {
      case 'Very Likely': return 'text-red-500';
      case 'Likely': return 'text-orange-500';
      case 'Possible': return 'text-yellow-500';
      case 'Unlikely': return 'text-blue-400';
      default: return 'text-green-500';
    }
  };

  return (
    <div>
      <FileUpload />

      <div className="space-y-3">
        <button
          onClick={detectHiddenData}
          disabled={isProcessing || !originalImage}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3
            ${(isProcessing || !originalImage)
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
              <Search className="w-5 h-5" />
              Analyze Image
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

      {detectionResults && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
        >
            <h3 className="font-medium text-white mb-2">Analysis Results</h3>
            {originalImage && (
                <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg">
                    <img
                        src={originalImage.url}
                        alt="Analyzed"
                        className="max-h-48 object-contain rounded-md"
                    />
                </div>
            )}
            <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-400">Likelihood</p>
                        <p className={`text-lg font-bold ${getLikelihoodColor(detectionResults.likelihood)}`}>
                            {detectionResults.likelihood}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Confidence</p>
                        <p className="text-lg font-bold text-white">{detectionResults.confidence}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Suspicion Score</p>
                        <p className="text-lg font-bold text-white">{detectionResults.suspicionScore}/100</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">LSB 1s Ratio</p>
                        <p className="text-lg font-bold text-white">{detectionResults.lsbRatio}%</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="font-medium text-white mb-2">Technical Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-400">Total Pixels: </span><span className="text-white">{detectionResults.totalPixels.toLocaleString()}</span></div>
                        <div><span className="text-gray-400">Color Variance: </span><span className="text-white">{detectionResults.variance}</span></div>
                        <div><span className="text-gray-400">Seq. Patterns: </span><span className="text-white">{detectionResults.sequentialPatterns}</span></div>
                        <div><span className="text-gray-400">LSB Deviation: </span><span className="text-white">{detectionResults.details.lsbDeviation}%</span></div>
                    </div>
                </div>
            </div>
        </motion.div>
      )}

      {!originalImage && !detectionResults && (
         <div className="mt-8 flex flex-col items-center justify-center h-64 bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-600">
            <FileImage className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500">Upload an image to analyze</p>
        </div>
      )}
    </div>
  );
};

export default DetectHiddenDataTab;