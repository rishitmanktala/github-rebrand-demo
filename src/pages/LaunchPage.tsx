import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Check, Merge, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';

export default function LaunchPage() {
  const { lens, addToast } = useAppStore();
  const isClassic = lens === 'classic';

  const [checklist, setChecklist] = useState([
    { text: 'New logo finalised — before & after attached', done: true },
    { text: 'Colour update: clearer, more meaningful accents', done: true },
    { text: 'Design guidelines published publicly for everyone to read', done: true },
    { text: 'What\'s-new notes written up for the release', done: true },
    { text: 'Community review: open for anyone to weigh in', done: false },
  ]);
  const [merged, setMerged] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const toggleCheck = (idx: number) => {
    const next = [...checklist];
    next[idx].done = !next[idx].done;
    setChecklist(next);
    addToast(`${next[idx].done ? 'Completed' : 'Reopened'}: ${next[idx].text}`, 'info');
  };

  const handleMerge = () => {
    setMerged(true);
    addToast('Release v2.0.0 shipped to production! 🚀', 'success');
  };

  if (merged) {
    return (
      <div className="fixed inset-0 z-50 bg-ship-green flex flex-col items-center justify-center text-white overflow-hidden font-display uppercase tracking-tighter p-4">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: [1, 1.2, 1], opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          <img src="/brand/logo.png" className="w-48 h-48 rounded-full mb-8 shadow-2xl" style={{ filter: 'brightness(100) grayscale(100%)' }} alt="Shipped Logo" />
        </motion.div>
        <motion.h1 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black text-center"
        >
          v2.0.0 Shipped.
        </motion.h1>

        {/* Exit & Return Controls per UX Remediation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/react/react"
            className="px-6 py-3 bg-white text-ship-green font-display font-black uppercase text-sm border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:bg-gray-100 transition flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Return to Workshop</span>
          </Link>
          <button
            onClick={() => setMerged(false)}
            className="px-6 py-3 bg-ship-green/80 border-2 border-white text-white font-display font-bold uppercase text-sm hover:bg-ship-green transition flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Reset Release Demo</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 transition-colors ${
      isClassic ? 'font-classic bg-canvas text-paper' : 'font-people text-ink'
    }`}>
      <div className={`mb-8 pb-6 ${isClassic ? 'border-b border-gray-800' : 'border-b-4 border-ink'}`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-ship-green text-white px-3 py-1 rounded-sm text-sm font-bold flex items-center space-x-1 uppercase">
            <GitPullRequest size={16} /> <span>Open</span>
          </div>
          <span className={`font-code text-sm ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>new-look → live</span>
        </div>
        <h1 className={`text-4xl md:text-5xl font-display font-black tracking-tighter uppercase leading-tight ${
          isClassic ? 'text-white' : 'text-ink'
        }`}>
          GitHub's New Look: Where Everyone Builds Together <span className={`font-light ${isClassic ? 'text-gray-500' : 'text-gray-400'}`}>#2024</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className={`text-xl font-bold mb-4 font-display uppercase ${isClassic ? 'text-white' : 'text-ink'}`}>
              The Launch Checklist
            </h2>
            <div className={`space-y-2 p-4 ${
              isClassic 
                ? 'border border-gray-700 bg-[#161b22] rounded-md' 
                : 'border-2 border-ink bg-white shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
            }`}>
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 cursor-pointer group" onClick={() => toggleCheck(idx)}>
                  <div className={`w-6 h-6 flex items-center justify-center transition-colors ${
                    isClassic
                      ? item.done ? 'bg-ship-green text-white rounded' : 'border border-gray-600 bg-gray-800 rounded group-hover:border-gray-400'
                      : item.done ? 'bg-ship-green text-white border-2 border-ship-green' : 'bg-white border-2 border-ink text-transparent group-hover:bg-gray-100'
                  }`}>
                    <Check size={16} />
                  </div>
                  <span className={`font-semibold ${
                    item.done 
                      ? 'line-through text-gray-500' 
                      : isClassic ? 'text-gray-200' : 'text-ink'
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-bold mb-4 font-display uppercase ${isClassic ? 'text-white' : 'text-ink'}`}>
              The Logo Diff
            </h2>
            <div className={`overflow-hidden flex flex-col md:flex-row ${
              isClassic 
                ? 'border border-gray-700 rounded-md bg-[#161b22]' 
                : 'border-2 border-ink bg-white shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
            }`}>
              <div className={`w-full md:w-1/2 p-4 font-code text-sm flex flex-col justify-center ${
                isClassic 
                  ? 'border-b md:border-b-0 md:border-r border-gray-700 bg-[#0d1117]' 
                  : 'border-b-2 md:border-b-0 md:border-r-2 border-ink bg-gray-50'
              }`}>
                <div className="text-gray-500 mb-2">brand/logo.svg</div>
                <div className="text-gray-400">  &lt;svg&gt;</div>
                <div className="text-gray-400">    &lt;g id="silhouette"&gt;...&lt;/g&gt; <span className="italic opacity-60">// unchanged</span></div>
                <div className={`px-1 py-0.5 mt-1 border-l-4 ${
                  isClassic 
                    ? 'text-red-400 bg-red-950/40 border-red-500' 
                    : 'text-diff-red bg-red-100 border-diff-red'
                }`}>-   &lt;path d="uneven, 2008 linework" /&gt;</div>
                <div className={`px-1 py-0.5 mt-1 border-l-4 ${
                  isClassic 
                    ? 'text-green-400 bg-green-950/40 border-green-500' 
                    : 'text-ship-green bg-green-100 border-ship-green'
                }`}>+   &lt;path d="geometric, scales to 16px, mosaic activity grid" /&gt;</div>
                <div className="text-gray-400 mt-1">  &lt;/svg&gt;</div>
              </div>
              <div className="w-full md:w-1/2 p-8 relative flex items-center justify-center min-h-[250px] select-none">
                <div className="relative w-48 h-48 cursor-ew-resize group" onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                  setSliderPos((x / rect.width) * 100);
                }}>
                  {/* New Logo */}
                  <div className="absolute inset-0">
                    <img src="/brand/logo.png" className="w-full h-full rounded-full" draggable="false" alt="New Logo" />
                  </div>
                  {/* Old Logo Clipped */}
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                    <div className="w-48 h-48 bg-canvas text-paper rounded-full flex items-center justify-center p-4">
                      {/* Fake old logo for demo */}
                      <svg viewBox="0 0 16 16" width="100%" height="100%" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                      </svg>
                    </div>
                  </div>
                  {/* Slider Line */}
                  <div className={`absolute top-0 bottom-0 w-1 -ml-0.5 flex items-center justify-center ${isClassic ? 'bg-blue-500' : 'bg-ink'}`} style={{ left: `${sliderPos}%` }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                      isClassic ? 'bg-[#161b22] border border-gray-500' : 'bg-white border-2 border-ink'
                    }`}>
                      <span className={`text-xs font-bold ${isClassic ? 'text-blue-400' : 'text-ink'}`}>||</span>
                    </div>
                  </div>
                </div>
                <div className={`absolute bottom-2 left-4 text-xs font-bold uppercase ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>Old</div>
                <div className={`absolute bottom-2 right-4 text-xs font-bold uppercase ${isClassic ? 'text-gray-400' : 'text-gray-500'}`}>New</div>
              </div>
            </div>
          </section>
        </div>

        <div>
          {/* Release Notes Card with High Contrast */}
          <div className={`p-6 sticky top-24 ${
            isClassic 
              ? 'bg-[#161b22] border border-gray-700 rounded-md text-[#f0f6fc]' 
              : 'bg-white border-2 border-ink text-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
          }`}>
            <h3 className={`font-display uppercase font-black text-xl mb-4 ${isClassic ? 'text-white' : 'text-ink'}`}>
              Release Notes
            </h3>
            <div className="text-sm space-y-4 mb-6 leading-relaxed">
              <p><strong className={isClassic ? 'text-white' : 'text-ink'}>What changed:</strong> The look and feel of GitHub gets a big upgrade — more contrast, friendlier words, and a design that shows progress clearly.</p>
              <p><strong className={isClassic ? 'text-white' : 'text-ink'}>What stayed the same:</strong> The name, the logo mascot, and every feature you already rely on. Nothing was taken away.</p>
              <p><strong className={isClassic ? 'text-white' : 'text-ink'}>Why:</strong> GitHub has grown from a tool for hardcore coders into a place where designers, writers, and whole teams work. The design needed to catch up.</p>
              <blockquote className={`pl-4 italic p-3 ${
                isClassic 
                  ? 'border-l-4 border-blue-500 bg-[#0d1117] text-gray-300' 
                  : 'border-l-4 border-ink bg-gray-50 text-ink'
              }`}>
                "Nothing you rely on is being taken away."
              </blockquote>
            </div>
            
            <button 
              data-tour="merge-btn"
              onClick={handleMerge}
              className={`w-full font-bold py-3 px-4 uppercase tracking-wide flex items-center justify-center space-x-2 transition ${
                isClassic
                  ? 'bg-[#238636] hover:bg-[#2ea043] text-white rounded-md shadow'
                  : 'bg-ship-green hover:bg-green-600 text-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-1 hover:shadow-none'
              }`}
            >
              <Merge size={20} />
              <span>Merge Pull Request</span>
            </button>
            <div className={`text-xs text-center mt-3 font-semibold uppercase ${
              isClassic ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Community Review Approved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
