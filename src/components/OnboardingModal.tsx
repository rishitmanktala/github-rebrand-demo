import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Terminal, Users, Map } from 'lucide-react';

export default function OnboardingModal() {
  const { onboarded, setOnboarded, setLens, startTour } = useAppStore();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!onboarded) {
      const timer = setTimeout(() => setShow(true), 4000); // Wait for splash to finish
      return () => clearTimeout(timer);
    }
  }, [onboarded]);

  if (!show) return null;

  const handleSelect = (lens: 'classic' | 'studio') => {
    setLens(lens);
    setOnboarded(true);
    setShow(false);
    // Tour auto-starts from App.tsx via the onboarded effect
  };

  const handleSkipTour = (lens: 'classic' | 'studio') => {
    setLens(lens);
    setOnboarded(true);
    setShow(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center font-people"
      >
        <div className="bg-canvas text-paper border border-gray-700 rounded-xl p-8 max-w-3xl w-full mx-4 shadow-2xl">
          <h2 className="text-3xl font-display font-black tracking-tighter uppercase mb-2 text-center">How do you like to work?</h2>
          <p className="text-gray-400 text-center mb-8">You can switch anytime. Nothing is exclusive to either.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button 
              onClick={() => handleSelect('classic')}
              className="flex flex-col items-center p-8 border border-gray-700 rounded-lg hover:border-ship-green hover:bg-gray-800/50 transition text-left group"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:text-ship-green">
                <Terminal size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Classic</h3>
              <p className="text-gray-400 text-sm text-center">Dense, fast, keyboard-first. The GitHub you know.</p>
            </button>

            <button 
              onClick={() => handleSelect('studio')}
              className="flex flex-col items-center p-8 border border-gray-700 rounded-lg bg-paper-warm text-ink hover:border-ink hover:shadow-lg transition text-left group"
            >
              <div className="w-16 h-16 bg-ink text-paper-warm rounded-full flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display uppercase tracking-tight">Studio</h3>
              <p className="text-gray-600 text-sm text-center">Activity-first, guided, social. Where we build together.</p>
            </button>
          </div>

          {/* Tour CTA */}
          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Map size={16} className="text-highlight-yellow" />
                <span className="font-bold text-sm text-white">Guided Tour</span>
              </div>
              <p className="text-xs text-gray-400">
                We'll walk you through every surface — takes about 2 minutes.
              </p>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => handleSkipTour('classic')}
                className="text-xs text-gray-500 hover:text-gray-300 transition underline"
              >
                Skip, explore freely
              </button>
              <button
                onClick={() => { handleSelect('studio'); }}
                className="px-5 py-2.5 bg-highlight-yellow text-ink font-bold text-sm uppercase tracking-wide border-2 border-ink shadow-[3px_3px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition flex items-center space-x-2"
              >
                <Map size={14} />
                <span>Take the Tour</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
