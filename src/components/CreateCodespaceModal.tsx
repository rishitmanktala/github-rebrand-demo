import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Terminal, Cpu, GitBranch, Globe, X, Play } from 'lucide-react';

export default function CreateCodespaceModal() {
  const { activeModal, setActiveModal, addToast, lens } = useAppStore();
  const [selectedRepo, setSelectedRepo] = useState('facebook/react');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [machineType, setMachineType] = useState('4-core');
  const [region, setRegion] = useState('us-east');

  if (activeModal !== 'create-codespace') return null;

  const handleClose = () => {
    setActiveModal(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Codespace launched for ${selectedRepo} (${machineType})!`, 'success');
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
            <div className={`p-2 rounded-lg ${isClassic ? 'bg-gray-800 text-ai-blue' : 'bg-ai-blue text-white border-2 border-ink'}`}>
              <Terminal size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isClassic ? 'font-classic' : 'font-display uppercase tracking-tight'}`}>
                Create new codespace
              </h2>
              <p className={`text-xs ${isClassic ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
                Instant cloud development environment pre-configured with your devcontainer.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            {/* Repository Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Repository
              </label>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className={`w-full px-3 py-2 rounded text-sm outline-none transition font-semibold ${
                  isClassic 
                    ? 'bg-[#0d1117] border border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border-2 border-ink text-ink'
                }`}
              >
                <option value="facebook/react">facebook/react (main)</option>
                <option value="shadcn/ui">shadcn/ui (main)</option>
                <option value="cyfernode/runtime">cyfernode/runtime (v2.0)</option>
                <option value="tailwindlabs/tailwindcss">tailwindlabs/tailwindcss (main)</option>
              </select>
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <GitBranch size={13} />
                <span>Branch</span>
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={`w-full px-3 py-2 rounded text-sm outline-none transition ${
                  isClassic 
                    ? 'bg-[#0d1117] border border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border-2 border-ink text-ink font-bold'
                }`}
              >
                <option value="main">main (default)</option>
                <option value="move-client-code">move-client-code (PR #28271)</option>
                <option value="feat/studio-lens">feat/studio-lens</option>
                <option value="v19-canary">v19-canary</option>
              </select>
            </div>

            {/* Machine Specs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Cpu size={13} />
                <span>Machine type</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '2-core', name: '2-core', ram: '8 GB RAM', storage: '32 GB SSD' },
                  { id: '4-core', name: '4-core', ram: '16 GB RAM', storage: '64 GB SSD' },
                  { id: '8-core', name: '8-core', ram: '32 GB RAM', storage: '128 GB SSD' },
                ].map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setMachineType(spec.id)}
                    className={`p-2.5 text-left rounded border transition ${
                      machineType === spec.id
                        ? isClassic
                          ? 'border-blue-500 bg-blue-900/30 text-white'
                          : 'border-2 border-ink bg-highlight-yellow text-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                        : isClassic
                          ? 'border-gray-700 bg-[#0d1117] text-gray-400 hover:border-gray-500'
                          : 'border-2 border-ink bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase">{spec.name}</div>
                    <div className="text-[11px] opacity-80">{spec.ram}</div>
                    <div className="text-[10px] opacity-60">{spec.storage}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Globe size={13} />
                <span>Region</span>
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={`w-full px-3 py-2 rounded text-sm outline-none transition ${
                  isClassic 
                    ? 'bg-[#0d1117] border border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border-2 border-ink text-ink font-bold'
                }`}
              >
                <option value="us-east">US East (N. Virginia) - Lowest latency</option>
                <option value="us-west">US West (Oregon)</option>
                <option value="eu-west">Europe West (Frankfurt)</option>
                <option value="ap-southeast">Southeast Asia (Singapore)</option>
              </select>
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
                    : 'bg-ai-blue text-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none'
                }`}
              >
                <Play size={14} />
                <span>Create codespace</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
