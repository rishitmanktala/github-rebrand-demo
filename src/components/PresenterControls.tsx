import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Play, X, Map } from 'lucide-react';

export default function PresenterControls() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { lens, setLens, setActiveModal, startTour, jumpTourStep } = useAppStore();

  const isClassic = lens === 'classic';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'p') {
        setVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!visible) return null;

  const steps = [
    { name: '1 Splash (Reload)', action: () => { sessionStorage.removeItem('splash_shown'); window.location.reload(); } },
    { name: '2 Repo (Classic)', action: () => { setLens('classic'); navigate('/react/react'); } },
    { name: '3 Switch to Studio', action: () => { setLens('studio'); } },
    { name: '4 PR Conversation', action: () => { navigate('/react/react/pull/28271'); } },
    { name: '5 Files Changed', action: () => { navigate('/react/react/pull/28271/changes'); } },
    { name: '6 Profile', action: () => { navigate('/shadcn'); } },
    { name: '7 Launch PR', action: () => { navigate('/launch'); } },
    { name: '8 Brand System', action: () => { navigate('/brand'); } },
  ];

  const autoPlayTour = async () => {
    for (const step of steps.slice(1)) {
      step.action();
      await new Promise(r => setTimeout(r, 4000));
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 p-4 transition-all w-72 ${
      isClassic 
        ? 'bg-canvas text-paper border border-gray-700 rounded-md shadow-2xl font-classic text-sm' 
        : 'bg-paper-warm text-ink border-2 border-ink shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] font-people text-sm studio-texture'
    }`}>
      <div className={`flex justify-between items-center mb-3 pb-2 border-b ${isClassic ? 'border-gray-800' : 'border-b-2 border-ink'}`}>
        <div className="flex items-center space-x-2">
          <h4 className={`font-bold ${isClassic ? 'text-white' : 'font-display uppercase tracking-tight text-ink'}`}>Presenter Mode</h4>
          <span className="text-[10px] text-gray-500 font-mono">Shift+P</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={autoPlayTour} 
            className="text-ship-green hover:text-green-400 flex items-center space-x-1 font-bold text-xs uppercase" 
            title="Auto-play Tour"
          >
            <Play size={13} /> <span>Play</span>
          </button>
          <button
            onClick={() => setVisible(false)}
            className={`p-1 rounded transition ${isClassic ? 'text-gray-400 hover:text-white' : 'text-ink hover:bg-gray-200'}`}
            aria-label="Close presenter controls"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Guided Tour Controls */}
      <div className={`mb-3 pb-3 border-b ${isClassic ? 'border-gray-800' : 'border-b-2 border-ink'}`}>
        <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isClassic ? 'text-gray-500' : 'text-gray-400'}`}>Guided Tour</div>
        <button
          onClick={() => { startTour(); setVisible(false); }}
          className={`w-full text-left px-2 py-1.5 text-xs font-bold uppercase tracking-tight flex items-center space-x-2 transition ${
            isClassic 
              ? 'bg-blue-600 hover:bg-blue-500 text-white rounded'
              : 'bg-ink text-paper-warm hover:bg-gray-800'
          }`}
        >
          <Map size={12} />
          <span>Start Guided Tour</span>
        </button>
        <div className={`flex flex-wrap gap-1 mt-1.5`}>
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => { jumpTourStep(i); setVisible(false); }}
              className={`text-[10px] w-6 h-6 flex items-center justify-center border font-bold transition ${
                isClassic
                  ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-white rounded'
                  : 'border-ink text-ink hover:bg-highlight-yellow'
              }`}
              title={`Jump to tour step ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-1.5">
        {steps.map(step => (
          <button 
            key={step.name} 
            onClick={step.action}
            className={`text-left px-2 py-1 text-xs rounded transition ${
              isClassic 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-ink hover:bg-highlight-yellow font-bold uppercase tracking-tight'
            }`}
          >
            {step.name}
          </button>
        ))}
      </div>

      <div className={`mt-3 pt-3 border-t ${isClassic ? 'border-gray-800' : 'border-t-2 border-ink'}`}>
        <button 
          onClick={() => setActiveModal('graduation')} 
          className={`w-full text-left px-2 py-1 text-xs transition ${
            isClassic ? 'text-gray-500 hover:text-gray-300' : 'text-ink/70 hover:text-ink font-semibold'
          }`}
        >
          Trigger Graduation Nudge
        </button>
      </div>
    </div>
  );
}
