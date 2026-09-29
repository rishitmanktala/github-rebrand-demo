import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { BookMarked, Globe, Lock, X, Check } from 'lucide-react';

export default function CreateRepoModal() {
  const { activeModal, setActiveModal, addToast, lens } = useAppStore();
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [addReadme, setAddReadme] = useState(true);

  if (activeModal !== 'create-repo') return null;

  const handleClose = () => {
    setActiveModal(null);
    setRepoName('');
    setDescription('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = repoName.trim() || 'new-repository';
    addToast(`Repository ${finalName} created!`, 'success');
    handleClose();
  };

  const isClassic = lens === 'classic';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-people cursor-pointer"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-xl w-full p-6 relative overflow-hidden cursor-default ${
            isClassic 
              ? 'bg-[#161b22] text-[#f0f6fc] border border-gray-700 rounded-lg shadow-2xl font-classic' 
              : 'bg-paper-warm text-ink border-4 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-1.5 rounded transition ${
              isClassic ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-ink hover:bg-gray-200 border-2 border-transparent hover:border-ink'
            }`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${isClassic ? 'bg-gray-800 text-blue-400' : 'bg-highlight-yellow text-ink border-2 border-ink'}`}>
              <BookMarked size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isClassic ? 'font-classic' : 'font-display uppercase tracking-tight'}`}>
                Create a new repository
              </h2>
              <p className={`text-xs ${isClassic ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
                A repository contains all project files, including the revision history.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Repository name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-2 rounded text-xs font-mono border ${
                  isClassic ? 'bg-[#0d1117] border-gray-700 text-gray-400' : 'bg-white border-2 border-ink text-gray-600'
                }`}>
                  demo-user /
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. quantum-algorithm"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded text-sm outline-none transition ${
                    isClassic 
                      ? 'bg-[#0d1117] border border-gray-700 text-white focus:border-blue-500' 
                      : 'bg-white border-2 border-ink text-ink font-bold focus:bg-yellow-50'
                  }`}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Description <span className={`text-xs font-normal ${isClassic ? 'text-gray-500' : 'text-gray-500'}`}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Short description of your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-2 rounded text-sm outline-none transition ${
                  isClassic 
                    ? 'bg-[#0d1117] border border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border-2 border-ink text-ink'
                }`}
              />
            </div>

            {/* Visibility options */}
            <div className={`p-3 rounded-md border space-y-3 ${isClassic ? 'border-gray-800 bg-[#0d1117]' : 'border-2 border-ink bg-white'}`}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5 font-bold text-xs uppercase">
                    <Globe size={14} className={visibility === 'public' ? 'text-ship-green' : 'text-gray-400'} />
                    <span>Public</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5 font-bold text-xs uppercase">
                    <Lock size={14} className={visibility === 'private' ? 'text-review-amber' : 'text-gray-400'} />
                    <span>Private</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </label>
            </div>

            {/* Initialize with README */}
            <div className="pt-1">
              <label className="flex items-center space-x-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addReadme}
                  onChange={(e) => setAddReadme(e.target.checked)}
                  className="rounded"
                />
                <span className="font-semibold">Add a README file</span>
              </label>
            </div>

            <div className={`flex justify-end space-x-3 pt-4 border-t ${isClassic ? 'border-gray-700/50' : 'border-t-2 border-ink'}`}>
              <button
                type="button"
                onClick={handleClose}
                className={`px-4 py-2 text-xs font-bold uppercase rounded transition ${
                  isClassic 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white border-2 border-ink text-ink hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-bold uppercase rounded transition flex items-center space-x-1.5 ${
                  isClassic 
                    ? 'bg-[#238636] hover:bg-[#2ea043] text-white shadow' 
                    : 'bg-ship-green text-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none'
                }`}
              >
                <Check size={14} />
                <span>Create repository</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
