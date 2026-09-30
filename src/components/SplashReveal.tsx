import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashReveal() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('splash_shown'));
  
  useEffect(() => {
    if (show) {
      sessionStorage.setItem('splash_shown', 'true');
      const timer = setTimeout(() => setShow(false), 3500);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShow(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-canvas flex flex-col items-center justify-center font-code text-paper cursor-pointer"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setShow(false)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShow(false);
          }}
          className="absolute top-6 right-6 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded transition"
          aria-label="Skip splash"
        >
          Skip ✕
        </button>
        <div className="flex flex-col items-start w-[400px]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-diff-red mb-2 flex items-center space-x-4"
          >
            <span>-</span>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              {/* Fake old octocat SVG outline */}
              <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="text-ship-green mb-8 flex items-center space-x-4"
          >
            <span>+</span>
            <img src="/brand/logo.png" alt="New Logo" className="w-16 h-16 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-gray-400 text-sm tracking-widest uppercase font-display"
          >
            A fresh look for GitHub — built together.
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
