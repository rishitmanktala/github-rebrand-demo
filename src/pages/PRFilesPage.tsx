import React, { useState } from 'react';
import { useAppStore } from '../store';
import prFilesData from '../data/pr.28271.files.json';
import { FileCode2, Code2, SplitSquareHorizontal, LayoutTemplate, Sparkles } from 'lucide-react';

function ClassicPRFiles() {
  const [diffView, setDiffView] = useState<'unified'|'split'>('unified');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-classic">
      <div data-tour="diff-toolbar" className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
        <div className="text-white text-sm">
          Showing <strong>{prFilesData.changedFiles} changed files</strong> with <strong>{prFilesData.additions} additions</strong> and <strong>{prFilesData.deletions} deletions</strong>.
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setDiffView('unified')} 
            className={`border px-3 py-1 rounded-md text-sm flex items-center ${diffView === 'unified' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#21262d] border-gray-700 text-gray-300 hover:bg-gray-700'}`}
          >
            <LayoutTemplate size={14} className="mr-1"/> Unified
          </button>
          <button 
            onClick={() => setDiffView('split')} 
            className={`border px-3 py-1 rounded-md text-sm flex items-center ${diffView === 'split' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#21262d] border-gray-700 text-gray-300 hover:bg-gray-700'}`}
          >
            <SplitSquareHorizontal size={14} className="mr-1"/> Split
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {prFilesData.files.map((file, idx) => (
          <div key={idx} id={`file-${idx}`} className="border border-gray-700 rounded-md overflow-hidden">
            <div className="bg-[#161b22] px-4 py-2 border-b border-gray-700 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-white">
                <span className="text-gray-400">v</span>
                <span className="text-gray-400">1</span>
                <FileCode2 size={16} className="text-gray-500" />
                <span>{file.path}</span>
              </div>
              <div className="flex space-x-2 font-code text-xs">
                <span className="text-green-400">+{file.additions}</span>
                <span className="text-red-400">-{file.deletions}</span>
              </div>
            </div>
            
            {diffView === 'unified' ? (
              <div className="bg-[#0d1117] font-code text-xs overflow-x-auto">
                {file.hunks.map((hunk, hIdx) => (
                  <div key={hIdx}>
                    <div className="bg-blue-900/20 text-blue-300 px-4 py-1 text-gray-400 border-b border-gray-800">{hunk.header}</div>
                    {hunk.lines.map((line, lIdx) => (
                      <div key={lIdx} className={`flex px-4 py-0.5 ${line.type === 'addition' ? 'bg-green-900/20 text-green-300' : line.type === 'deletion' ? 'bg-red-900/20 text-red-300' : 'text-gray-300'}`}>
                        <span className="w-8 text-right pr-4 text-gray-500 select-none opacity-50">{line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' '}</span>
                        <span className="whitespace-pre">{line.content}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0d1117] font-code text-xs flex flex-col w-full">
                {file.hunks.map((hunk, hIdx) => (
                  <div key={hIdx} className="w-full">
                    <div className="bg-blue-900/20 text-blue-300 px-4 py-1 text-gray-400 border-b border-gray-800 w-full">{hunk.header}</div>
                    <div className="w-full">
                      {hunk.lines.map((line, lIdx) => (
                        <div key={lIdx} className="flex w-full">
                           {/* Left Side (Deletions & Context) */}
                           <div className={`w-1/2 flex border-r border-gray-800 px-4 py-0.5 ${line.type === 'deletion' ? 'bg-red-900/20 text-red-300' : line.type === 'addition' ? 'bg-[#0d1117] text-transparent select-none' : 'text-gray-300'}`}>
                             <span className={`w-8 text-right pr-4 text-gray-500 select-none opacity-50 ${line.type === 'addition' && 'text-transparent'}`}>{line.type === 'deletion' ? '-' : (line.type === 'context' ? ' ' : '')}</span>
                             <span className="whitespace-pre overflow-hidden text-ellipsis">{line.type === 'addition' ? ' ' : line.content}</span>
                           </div>
                           {/* Right Side (Additions & Context) */}
                           <div className={`w-1/2 flex px-4 py-0.5 ${line.type === 'addition' ? 'bg-green-900/20 text-green-300' : line.type === 'deletion' ? 'bg-[#0d1117] text-transparent select-none' : 'text-gray-300'}`}>
                             <span className={`w-8 text-right pr-4 text-gray-500 select-none opacity-50 ${line.type === 'deletion' && 'text-transparent'}`}>{line.type === 'addition' ? '+' : (line.type === 'context' ? ' ' : '')}</span>
                             <span className="whitespace-pre overflow-hidden text-ellipsis">{line.type === 'deletion' ? ' ' : line.content}</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioPRFiles() {
  const [view, setView] = React.useState<'intent'|'raw'>('intent');
  const { addToast } = useAppStore();

  if (view === 'raw') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 font-people studio-texture">
        <div className="flex items-center justify-between mb-6 bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div>
            <h2 className="text-xl font-display font-black uppercase text-ink">Raw Diff Inspection</h2>
            <p className="text-xs font-semibold text-ink/60">Direct diff viewer mounted within Studio workshop</p>
          </div>
          <button 
            onClick={() => setView('intent')} 
            className="bg-ink text-paper-warm px-4 py-2 font-bold uppercase text-xs border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none transition"
          >
            Back to Visual Explanation
          </button>
        </div>
        <div className="border-2 border-ink bg-[#0d1117] overflow-hidden shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <ClassicPRFiles />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people studio-texture">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-display font-black uppercase tracking-tight text-ink">
          Visual Diff Explanation
        </h1>
        <button onClick={() => setView('raw')} className="bg-white border-2 border-ink text-ink px-4 py-2 font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none transition flex items-center space-x-2">
          <Code2 size={16} /> <span>View Raw Diff</span>
        </button>
      </div>

      <div className="mb-12">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">// Change Map (Size = Lines Changed, Color = Add/Remove Ratio)</div>
        <div className="h-16 flex border-2 border-ink bg-white overflow-hidden">
          {prFilesData.files.map((file, idx) => {
            const total = file.additions + file.deletions;
            const greenPercent = (file.additions / total) * 100;
            return (
              <div 
                key={idx} 
                onClick={() => {
                  const targetEl = document.getElementById(`file-${idx}`);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.classList.add('ring-4', 'ring-ship-green', 'transition-all');
                    setTimeout(() => {
                      targetEl.classList.remove('ring-4', 'ring-ship-green');
                    }, 2000);
                  }
                  addToast(`Scrolled to ${file.path.split('/').pop()}`, 'info');
                }} 
                className="h-full border-r-2 border-ink last:border-r-0 relative group cursor-pointer hover:opacity-90" 
                style={{ width: `${Math.max(10, (total / (prFilesData.additions + prFilesData.deletions)) * 100)}%` }}
              >
                <div className="absolute inset-0 bg-diff-red z-0"></div>
                <div className="absolute top-0 bottom-0 left-0 bg-ship-green z-10" style={{ width: `${greenPercent}%` }}></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-20 font-bold uppercase">
                  {file.path.split('/').pop()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-12">
        {prFilesData.intents.map((intent, idx) => (
          <div key={idx} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-blue-50 border-2 border-ai-blue p-6 sticky top-24">
                <div className="flex items-center space-x-2 text-ai-blue font-bold font-display uppercase tracking-tight mb-4">
                  <Sparkles size={16} /> <span>Intent {idx + 1}</span>
                </div>
                <h3 className="text-xl font-black font-display uppercase tracking-tight text-blue-900 mb-2">{intent.name}</h3>
                <p className="text-sm text-blue-900">{intent.description}</p>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              {intent.files.map((path, pIdx) => {
                const file = prFilesData.files.find(f => f.path === path);
                if (!file) return null;
                const fileIdx = prFilesData.files.findIndex(f => f.path === path);
                return (
                  <div key={pIdx} id={`file-${fileIdx}`} className="bg-white border-2 border-ink overflow-hidden shadow-sm">
                    <div className="bg-gray-100 border-b-2 border-ink px-4 py-3 flex items-center justify-between">
                      <div className="font-bold text-sm tracking-tight">{file.path}</div>
                      <div className="flex space-x-3 text-xs font-bold uppercase">
                        <span className="text-ship-green">+{file.additions}</span>
                        <span className="text-diff-red">-{file.deletions}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 font-code text-sm overflow-x-auto">
                      {file.hunks.map((hunk, hIdx) => (
                        <div key={hIdx} className="mb-4 last:mb-0">
                          {hunk.lines.map((line, lIdx) => (
                            <div key={lIdx} className={`px-2 py-1 flex ${line.type === 'addition' ? 'bg-green-100 text-green-900' : line.type === 'deletion' ? 'bg-red-100 text-red-900' : 'text-gray-500'}`}>
                               <span className="w-6 text-right pr-2 select-none opacity-50 font-bold">{line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ''}</span>
                               <span className="whitespace-pre">{line.content}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PRFilesPage() {
  const { lens, addToast } = useAppStore();

  React.useEffect(() => {
    let currentIdx = -1;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'j') {
        e.preventDefault();
        currentIdx = Math.min(prFilesData.files.length - 1, currentIdx + 1);
        const targetEl = document.getElementById(`file-${currentIdx}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.add('ring-4', 'ring-blue-500', 'transition-all');
          setTimeout(() => targetEl.classList.remove('ring-4', 'ring-blue-500'), 1500);
          addToast(`Next file (j): ${prFilesData.files[currentIdx].path.split('/').pop()}`, 'info');
        }
      } else if (e.key === 'k') {
        e.preventDefault();
        currentIdx = Math.max(0, currentIdx - 1);
        const targetEl = document.getElementById(`file-${currentIdx}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.add('ring-4', 'ring-blue-500', 'transition-all');
          setTimeout(() => targetEl.classList.remove('ring-4', 'ring-blue-500'), 1500);
          addToast(`Previous file (k): ${prFilesData.files[currentIdx].path.split('/').pop()}`, 'info');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToast]);

  return lens === 'classic' ? <ClassicPRFiles /> : <StudioPRFiles />;
}
