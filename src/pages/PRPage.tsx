import React, { useState } from 'react';
import { useAppStore } from '../store';
import prData from '../data/pr.28271.json';
import { GitPullRequest, GitMerge, CheckCircle, Sparkles, MessageSquare, GitCommit, ShieldCheck, FileDiff, X, Terminal, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CI_JOBS = [
  { name: 'build-dom', duration: '48s', desc: 'Rollup packaging for react-dom client & server entrypoints' },
  { name: 'test-ssr', duration: '1m 12s', desc: 'Hydration and streaming SSR compatibility test suite' },
  { name: 'typecheck', duration: '34s', desc: 'TypeScript compiler strict mode verification' },
  { name: 'eslint-core', duration: '22s', desc: 'AST and rule validation across packages' },
  { name: 'bundle-size', duration: '18s', desc: 'Size limit threshold audit (-1.2 kB change)' },
  { name: 'test-fixtures', duration: '2m 04s', desc: 'Browser fixture hydration and event delegation' },
  { name: 'lint-formatting', duration: '15s', desc: 'Prettier and formatting rule compliance' },
  { name: 'compat-v18', duration: '55s', desc: 'Backwards-compatibility verification' },
  { name: 'security-audit', duration: '30s', desc: 'Dependabot & supply-chain vulnerability scan' },
  { name: 'server-components', duration: '1m 45s', desc: 'RSC flight protocol and client boundary tests' },
  { name: 'license-check', duration: '12s', desc: 'Header license & attribution check' },
  { name: 'release-dry-run', duration: '40s', desc: 'NPM tarball pack and provenance generation' },
];

function CheckInspectorModal({ job, onClose, isClassic }: { job: typeof CI_JOBS[0] | null; onClose: () => void; isClassic: boolean }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        className={`max-w-2xl w-full p-6 relative ${
          isClassic 
            ? 'bg-[#161b22] text-[#f0f6fc] border border-gray-700 rounded-lg shadow-2xl font-classic' 
            : 'bg-paper-warm text-ink border-4 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] font-people'
        }`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded transition ${isClassic ? 'text-gray-400 hover:text-white' : 'text-ink hover:bg-gray-200'}`}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-ship-green/20 text-ship-green rounded-full flex items-center justify-center border border-ship-green">
            <CheckCircle size={22} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isClassic ? 'font-classic' : 'font-display uppercase tracking-tight'}`}>
              Job: {job.name}
            </h3>
            <p className={`text-xs ${isClassic ? 'text-gray-400' : 'text-ink/60'}`}>
              Completed in {job.duration} · Runner: <span className={`font-mono ${isClassic ? 'text-gray-300' : 'text-ink font-semibold'}`}>ubuntu-latest</span>
            </p>
          </div>
        </div>

        <p className="text-sm mb-4 opacity-90">{job.desc}</p>

        <div className={`p-4 rounded font-mono text-xs overflow-x-auto space-y-1 ${isClassic ? 'bg-[#0d1117] border border-gray-800 text-gray-300' : 'bg-canvas text-paper border-2 border-ink'}`}>
          <div className="text-gray-500 flex items-center space-x-2">
            <Terminal size={14} />
            <span>git checkout -qf 8b4ef21</span>
          </div>
          <div className="text-blue-400">$ node ./scripts/rollup/build.js --packages=react-dom</div>
          <div className="text-gray-400">Compiling 18 modules for ESM and CJS targets...</div>
          <div className="text-ship-green font-bold">✓ Successfully transformed in {job.duration}</div>
          <div className="text-gray-400">Artifact size: 42.1 kB (gzip: 11.4 kB)</div>
          <div className="text-ship-green">✓ All assertions passed. Exit status 0.</div>
        </div>

        <div className={`flex justify-end pt-4 mt-4 border-t ${isClassic ? 'border-gray-700/50' : 'border-t-2 border-ink'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded ${
              isClassic 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white border-2 border-ink text-ink hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PRTabs({ activeTab, isClassic }: { activeTab: 'conversation' | 'commits' | 'checks' | 'files', isClassic: boolean }) {
  const { addToast } = useAppStore();

  const handleCommitsClick = () => {
    const el = document.getElementById('commits-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-blue-500');
      setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500'), 1500);
    }
    addToast('Commit 8b4ef21: Separate client-side react-dom entry', 'info');
  };

  const handleChecksClick = () => {
    const el = document.getElementById('checks-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', isClassic ? 'ring-blue-500' : 'ring-ship-green');
      setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500', 'ring-ship-green'), 1500);
    }
    addToast('Viewing CI Checks (12/12 passing)', 'info');
  };

  if (isClassic) {
    return (
      <div className="flex space-x-1 border-b border-gray-800 mb-6 font-classic text-sm">
        <Link 
          to="/react/react/pull/28271" 
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium transition ${activeTab === 'conversation' ? 'text-white border-orange-500 font-semibold' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
        >
          <MessageSquare size={16} />
          <span>Conversation</span>
        </Link>
        <div 
          onClick={handleCommitsClick}
          className="flex items-center space-x-2 px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-gray-200 cursor-pointer transition"
        >
          <GitCommit size={16} />
          <span>Commits</span>
          <span className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.2 rounded-full">1</span>
        </div>
        <div 
          onClick={handleChecksClick}
          className="flex items-center space-x-2 px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-gray-200 cursor-pointer transition"
        >
          <ShieldCheck size={16} />
          <span>Checks</span>
          <span className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.2 rounded-full">12</span>
        </div>
        <Link 
          to="/react/react/pull/28271/changes" 
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium transition ${activeTab === 'files' ? 'text-white border-orange-500 font-semibold' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
        >
          <FileDiff size={16} />
          <span>Files changed</span>
          <span className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.2 rounded-full">4</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex space-x-2 border-b-2 border-ink mb-8 font-people">
      <Link 
        to="/react/react/pull/28271" 
        className={`px-4 py-2 border-2 border-b-0 border-ink font-bold text-xs uppercase tracking-wider transition ${
          activeTab === 'conversation' ? 'bg-highlight-yellow text-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]' : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Conversation
      </Link>
      <div 
        onClick={handleCommitsClick}
        className="px-4 py-2 border-2 border-b-0 border-ink font-bold text-xs uppercase tracking-wider bg-white text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center space-x-1.5 transition"
      >
        <span>Commits</span>
        <span className="bg-ink text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">1</span>
      </div>
      <div 
        onClick={handleChecksClick}
        className="px-4 py-2 border-2 border-b-0 border-ink font-bold text-xs uppercase tracking-wider bg-white text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center space-x-1.5 transition"
      >
        <span>Checks</span>
        <span className="bg-ship-green text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">12/12</span>
      </div>
      <Link 
        to="/react/react/pull/28271/changes" 
        className={`px-4 py-2 border-2 border-b-0 border-ink font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1.5 ${
          activeTab === 'files' ? 'bg-highlight-yellow text-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]' : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <span>Files changed</span>
        <span className="bg-ink text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">4</span>
      </Link>
    </div>
  );
}

function ClassicPR() {
  const [merged, setMerged] = React.useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof CI_JOBS[0] | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>('Refactor');
  const { addToast } = useAppStore();

  const handleMerge = () => {
    setMerged(true);
    addToast('Pull request #28271 merged successfully into main!', 'success');
  };

  const handleToggleLabel = (label: string) => {
    const isCurrentlyActive = activeLabel === label;
    setActiveLabel(isCurrentlyActive ? null : label);
    addToast(isCurrentlyActive ? `Cleared label filter: ${label}` : `Filtered by label: ${label}`, 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-classic">
      <CheckInspectorModal job={selectedJob} onClose={() => setSelectedJob(null)} isClassic={true} />

      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-white mb-2">
          {prData.title} <span className="text-gray-400 font-light">#{prData.id}</span>
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6 border-b border-gray-800 pb-4">
          <div className={`px-3 py-1 rounded-full font-semibold flex items-center space-x-1 ${merged ? 'bg-purple-600 text-white' : 'bg-[#238636] text-white'}`}>
            {merged ? <GitMerge size={16} /> : <GitPullRequest size={16} />} 
            <span>{merged ? 'Merged' : 'Open'}</span>
          </div>
          <span><strong className="text-white">{prData.author}</strong> wants to merge into <code>main</code> from <code>move-client-code</code></span>
        </div>
      </div>

      <PRTabs activeTab="conversation" isClassic={true} />
      
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex space-x-4">
            <img src={`https://github.com/${prData.author}.png`} className="w-10 h-10 rounded-full" alt="Author" />
            <div className="flex-1 border border-gray-700 rounded-md">
              <div className="bg-[#161b22] px-4 py-2 border-b border-gray-700 rounded-t-md text-sm">
                <strong className="text-white">{prData.author}</strong> commented 3 days ago
              </div>
              <div className="p-4 text-white text-sm whitespace-pre-wrap">
                {prData.description}
              </div>
            </div>
          </div>
          
          <div id="commits-section" className="pl-14 space-y-4">
            {prData.events.map((event, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-sm">
                {event.type === 'event' ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    </div>
                    <div className="pt-1 text-gray-400">{event.text}</div>
                  </>
                ) : (
                  <>
                    <img src={`https://github.com/${event.author}.png`} className="w-8 h-8 rounded-full" alt="Author" />
                    <div className="flex-1 border border-gray-800 rounded-md bg-[#161b22] p-3 text-gray-300">
                      <strong className="text-white">{event.author}</strong>: {event.body}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div id="checks-grid" className="pl-14">
            <div className={`border rounded-md p-4 text-sm ${merged ? 'border-purple-700 bg-purple-900/20' : 'border-green-700 bg-green-900/20'}`}>
               <div className={`flex items-center justify-between font-semibold mb-2 ${merged ? 'text-purple-400' : 'text-green-400'}`}>
                 <div className="flex items-center space-x-2">
                   <CheckCircle size={16} />
                   <span>{merged ? 'Merged successfully' : 'All 12 checks have passed'}</span>
                 </div>
                 <span className="text-xs text-gray-400">Click any check below for CI logs</span>
               </div>

               {/* Checks list */}
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-3">
                 {CI_JOBS.map((job, idx) => (
                   <div 
                     key={idx}
                     onClick={() => setSelectedJob(job)}
                     className="bg-[#161b22] border border-gray-700 hover:border-gray-500 p-2 rounded text-xs flex items-center space-x-1.5 cursor-pointer text-gray-300 hover:text-white"
                   >
                     <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
                     <span className="truncate">{job.name}</span>
                   </div>
                 ))}
               </div>

               {!merged && (
                 <button onClick={handleMerge} className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md font-semibold text-sm transition">
                   Merge pull request
                 </button>
               )}
            </div>
          </div>
        </div>
        
        <div className="w-64 hidden md:block space-y-6 text-sm text-gray-400">
          <div className="border-b border-gray-800 pb-2">
            <h3 className="font-semibold text-white mb-2">Reviewers</h3>
            <div><Link to="/sebmarkbage" className="hover:text-blue-400 text-gray-200 transition">sebmarkbage</Link></div>
          </div>
          <div className="border-b border-gray-800 pb-2">
            <h3 className="font-semibold text-white mb-2">Labels</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Refactor', 'React 19', 'Client API'].map((lbl) => (
                <div 
                  key={lbl}
                  onClick={() => handleToggleLabel(lbl)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer border transition ${
                    activeLabel === lbl
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-blue-900/40 text-blue-300 border-blue-700 hover:bg-blue-900/70'
                  }`}
                >
                  {lbl}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioPR() {
  const [merged, setMerged] = React.useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof CI_JOBS[0] | null>(null);
  const { addToast } = useAppStore();

  const handleMerge = () => {
    setMerged(true);
    addToast('Pull request #28271 merged successfully into main! 🎉', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people studio-texture">
      <CheckInspectorModal job={selectedJob} onClose={() => setSelectedJob(null)} isClassic={false} />

      <div className="mb-8 border-b-2 border-ink pb-6">
        <h1 className="text-4xl font-display font-black uppercase tracking-tight text-ink mb-4">
          {prData.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className={`px-3 py-1 font-bold uppercase text-xs tracking-wide border-2 border-ink ${merged ? 'bg-merge-purple text-white' : 'bg-ship-green text-white'}`}>
              {merged ? 'Merged' : 'Open'}
            </div>
            <div className="px-3 py-1 bg-white border-2 border-ink font-bold uppercase text-xs text-ink tracking-wide">
              {prData.author}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
             {/* Status Stepper */}
             <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-tight">
               <div className="flex items-center space-x-1 text-ship-green"><CheckCircle size={14}/> <span>Opened</span></div>
               <div className="w-4 h-0.5 bg-ink"></div>
               <div className="flex items-center space-x-1 text-review-amber"><CheckCircle size={14}/> <span>In Review</span></div>
               <div className="w-4 h-0.5 bg-ink"></div>
               <div className="flex items-center space-x-1 text-ship-green"><CheckCircle size={14}/> <span>Checks Pass</span></div>
               <div className="w-4 h-0.5 bg-ink"></div>
               <div className={`flex items-center space-x-1 ${merged ? 'text-merge-purple' : 'text-ink/60'}`}><GitMerge size={14}/> <span>Merged</span></div>
             </div>
          </div>
        </div>
      </div>

      <PRTabs activeTab="conversation" isClassic={false} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          <div className="bg-blue-50 border-2 border-ai-blue p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-ai-blue font-bold font-display uppercase tracking-tight mb-2">
              <Sparkles size={16} /> <span>Copilot Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-900 mt-4">
              <div>
                <strong className="block uppercase tracking-widest text-xs mb-1">What changed</strong>
                Moves client-side React DOM APIs (like hydrate) to a new react-dom/client entry point.
              </div>
              <div>
                <strong className="block uppercase tracking-widest text-xs mb-1">Why it matters</strong>
                Prepares the library for Server Components by strictly separating client and server APIs.
              </div>
            </div>
          </div>

          <div data-tour="pr-timeline" className="bg-white border-2 border-ink p-6 relative">
            <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-ink -z-0"></div>
            
            <div className="relative z-10 flex space-x-4 mb-8">
              <img src={`https://github.com/${prData.author}.png`} className="w-12 h-12 rounded-full border-2 border-ink bg-white" alt="Author" />
              <div className="flex-1 pt-1">
                <div className="font-bold text-sm uppercase tracking-tight text-gray-500 mb-1">{prData.author} opened this</div>
                <div className="text-lg font-medium">{prData.description}</div>
              </div>
            </div>

            <div id="commits-section" className="relative z-10 space-y-6 pl-2">
              {prData.events.map((event, idx) => (
                <div key={idx} className="flex space-x-4">
                  {event.type === 'event' ? (
                     <div className="w-12 flex justify-center pt-2"><div className="w-3 h-3 bg-white border-2 border-ink rounded-full"></div></div>
                  ) : (
                     <img src={`https://github.com/${event.author}.png`} className="w-12 h-12 rounded-full border-2 border-ink bg-white" alt="Author" />
                  )}
                  <div className="flex-1 pt-1">
                    {event.type === 'event' ? (
                      <div className="text-sm font-bold uppercase text-gray-500">{event.text}</div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-ink p-4">
                        <strong className="block uppercase text-xs tracking-tight text-gray-500 mb-2">{event.author} said...</strong>
                        <div>{event.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div id="checks-grid" className="bg-white border-2 border-ink p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black uppercase text-xl">Checks <span className="text-ship-green text-sm ml-2">12/12</span></h3>
              <span className="text-[11px] font-bold uppercase text-ink/60">Click to inspect</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {CI_JOBS.map((job, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedJob(job)}
                  className="h-10 bg-ship-green/20 hover:bg-ship-green text-ship-green hover:text-white border-2 border-ink flex flex-col items-center justify-center cursor-pointer transition shadow-[1px_1px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px group"
                  title={`${job.name} passed in ${job.duration} (Click to inspect log)`}
                >
                  <Check size={14} className="stroke-[3]" />
                  <span className="text-[9px] font-bold uppercase truncate max-w-[50px]">{job.name.split('-')[0]}</span>
                </div>
              ))}
            </div>
            
            {!merged && (
              <button 
                onClick={handleMerge}
                className="w-full bg-merge-purple text-white font-bold uppercase tracking-wide py-3 border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-1 hover:shadow-none transition flex items-center justify-center space-x-2"
              >
                <GitMerge size={18} /> <span>Merge Pull Request</span>
              </button>
            )}
            {merged && (
              <div className="w-full bg-merge-purple text-white font-bold uppercase tracking-wide py-3 border-2 border-ink text-center flex items-center justify-center space-x-2">
                 <CheckCircle size={18} /> <span>Merged Successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PRPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicPR /> : <StudioPR />;
}
