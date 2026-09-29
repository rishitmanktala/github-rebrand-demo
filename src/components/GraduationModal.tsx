import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Award, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GraduationModal() {
  const { activeModal, setActiveModal, setLens, addToast } = useAppStore();

  if (activeModal !== 'graduation') return null;

  const handleSwitchToStudio = () => {
    setLens('studio');
    setActiveModal(null);
    addToast('Welcome to GitHub Studio! 🎉', 'success');
  };

  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-people">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-paper-warm border-4 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] max-w-xl w-full p-8 relative overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 p-2 text-ink hover:bg-gray-200 rounded transition border-2 border-transparent hover:border-ink"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Banner Badge */}
          <div className="inline-flex items-center space-x-2 bg-highlight-yellow text-ink border-2 border-ink px-3 py-1 font-bold text-xs uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>Milestone Unlocked</span>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-merge-purple text-white border-2 border-ink rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
              <Award size={36} />
            </div>
            <div>
              <h2 className="text-3xl font-display font-black uppercase tracking-tight text-ink">
                20 PRs Reviewed!
              </h2>
              <p className="text-sm font-bold text-gray-600">
                You've graduated from Core Contributor to Studio Architect
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-ink p-5 mb-6 space-y-3">
            <p className="text-ink font-medium text-sm leading-relaxed">
              You have thoroughly explored pull requests and code diffs in Classic mode. You've officially unlocked <strong>GitHub Studio</strong>: an activity-first, tactile workshop designed for expressive collaboration.
            </p>
            <ul className="text-xs font-bold uppercase space-y-1.5 text-gray-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-ship-green" />
                <span>Visual diff intents & change mapping</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-ship-green" />
                <span>Integrated Copilot repository summaries</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-ship-green" />
                <span>Living portfolio & public build canvas</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleSwitchToStudio}
              className="flex-1 bg-ship-green text-white font-display font-black uppercase tracking-wider py-3 px-4 border-2 border-ink shadow-[3px_3px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none transition flex items-center justify-center space-x-2"
            >
              <span>Switch to Studio Lens</span>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleClose}
              className="bg-white text-ink font-bold uppercase text-xs py-3 px-5 border-2 border-ink hover:bg-gray-100 transition"
            >
              Stay in Classic
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
