import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Play, Square, Cpu, HardDrive, Terminal, Laptop, ExternalLink, 
  Sparkles, Plus, Clock, Globe, Shield, RefreshCw 
} from 'lucide-react';
import codespacesData from '../data/codespaces.json';

function ClassicCodespaces() {
  const { addToast } = useAppStore();
  const [codespaces, setCodespaces] = useState(codespacesData.codespaces);

  const toggleCodespaceState = (id: string) => {
    setCodespaces(prev => prev.map(cs => {
      if (cs.id === id) {
        const nextState = cs.state === 'Running' ? 'Shutdown' : 'Running';
        addToast(`Codespace ${cs.displayName} is now ${nextState.toLowerCase()}`, 'success');
        return { ...cs, state: nextState as any };
      }
      return cs;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Codespaces</h1>
          <p className="text-gray-400 text-sm mt-1">
            Cloud-hosted development environments powered by high-performance virtual machines.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/react/react"
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>New Codespace</span>
          </Link>
        </div>
      </div>

      {/* Usage Meter */}
      <div className="bg-[#161b22] border border-gray-700 rounded-md p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 font-medium">
            <span>Core Hours Used ({codespacesData.activeUsage.usedHours} / {codespacesData.activeUsage.totalHours} hrs)</span>
            <span>{Math.round((codespacesData.activeUsage.usedHours / codespacesData.activeUsage.totalHours) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#238636] h-full"
              style={{ width: `${(codespacesData.activeUsage.usedHours / codespacesData.activeUsage.totalHours) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-400 border-l border-gray-700 pl-4 hidden md:block">
          <div>Storage quota: <span className="text-white font-semibold">{codespacesData.activeUsage.storageGb} GB</span> / {codespacesData.activeUsage.storageLimitGb} GB</div>
          <div className="text-gray-500 mt-0.5">Quota renews in 12 days</div>
        </div>
      </div>

      {/* Codespaces Table */}
      <div className="border border-gray-700 rounded-md overflow-hidden bg-[#0d1117] mb-8">
        <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 flex items-center justify-between text-sm font-semibold text-gray-200">
          <span>Active & Saved Environments</span>
          <span className="text-xs text-gray-400 font-normal">{codespaces.length} environments total</span>
        </div>

        <div className="divide-y divide-gray-800">
          {codespaces.map((cs) => (
            <div key={cs.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#161b22]/50 transition">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {cs.state === 'Running' ? (
                    <div className="w-3 h-3 rounded-full bg-[#3fb950] animate-pulse" title="Running" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-500" title="Shutdown" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{cs.displayName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      cs.state === 'Running'
                        ? 'bg-green-950 border-green-700 text-green-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}>
                      {cs.state}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-blue-400">{cs.repo}</span>
                    <span>•</span>
                    <span className="font-mono">{cs.branch}</span>
                    <span>•</span>
                    <span>{cs.machine.cores} cores, {cs.machine.ramGb}GB RAM</span>
                    <span>•</span>
                    <span>Last used {cs.lastUsed}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleCodespaceState(cs.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center space-x-1.5 transition ${
                    cs.state === 'Running'
                      ? 'bg-red-950/40 border-red-800 text-red-300 hover:bg-red-900/60'
                      : 'bg-green-950/40 border-green-800 text-green-300 hover:bg-green-900/60'
                  }`}
                >
                  {cs.state === 'Running' ? (
                    <>
                      <Square size={13} />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} />
                      <span>Start</span>
                    </>
                  )}
                </button>
                <Link
                  to="/react/react"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-md text-xs font-medium border border-gray-700 transition flex items-center space-x-1"
                >
                  <span>Open in Browser</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Starter Templates */}
      <h2 className="text-lg font-semibold text-white mb-3">Quick-Start Templates</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {codespacesData.templates.map((tmpl) => (
          <div key={tmpl.id} className="bg-[#161b22] border border-gray-700 rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white text-sm">{tmpl.title}</span>
                <span className="text-xs bg-blue-950 border border-blue-800 text-blue-300 px-2 py-0.5 rounded-full">
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{tmpl.description}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-xs text-gray-500 font-mono">{tmpl.repo}</span>
              <button
                onClick={() => addToast(`Creating new codespace from ${tmpl.title}...`, 'info')}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded font-medium border border-gray-700 transition"
              >
                Use this template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioCodespaces() {
  const { addToast } = useAppStore();
  const [codespaces, setCodespaces] = useState(codespacesData.codespaces);
  const [selectedSpec, setSelectedSpec] = useState('4-core');

  const launchWorkshopSession = (name: string) => {
    addToast(`Launching instant cloud workshop: ${name}`, 'success');
  };

  const toggleState = (id: string) => {
    setCodespaces(prev => prev.map(c => {
      if (c.id === id) {
        const next = c.state === 'Running' ? 'Shutdown' : 'Running';
        addToast(`Environment ${c.displayName} toggled to ${next}`, 'info');
        return { ...c, state: next as any };
      }
      return c;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Hardware Orchestration
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Instant Workshop
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Zero setup latency. Dedicated pre-warmed virtual silicon ready for collaborative debugging.
          </p>
        </div>

        <button
          onClick={() => launchWorkshopSession('Default 4-Core Pod')}
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Sparkles size={16} />
          <span>Launch Cloud Node</span>
        </button>
      </div>

      {/* Hardware Dials Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>Core Capacity</span>
            <Cpu size={16} className="text-ship-green" />
          </div>
          <div className="text-3xl font-display font-black text-ink">32 Cores</div>
          <div className="text-xs text-ship-green font-bold mt-1">High-performance AMD EPYC</div>
        </div>

        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>RAM Available</span>
            <Laptop size={16} className="text-ai-blue" />
          </div>
          <div className="text-3xl font-display font-black text-ai-blue">64 GB</div>
          <div className="text-xs text-ink/60 font-bold mt-1">DDR5 ECC Memory</div>
        </div>

        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>NVMe Storage</span>
            <HardDrive size={16} className="text-review-amber" />
          </div>
          <div className="text-3xl font-display font-black text-review-amber">{codespacesData.activeUsage.storageGb} GB</div>
          <div className="text-xs text-ink/60 font-bold mt-1">PCIe Gen4 throughput</div>
        </div>

        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>Cold-Start Speed</span>
            <Sparkles size={16} className="text-ink fill-highlight-yellow" />
          </div>
          <div className="text-3xl font-display font-black text-ink">&lt; 3.2s</div>
          <div className="text-xs text-ship-green font-bold mt-1">Pre-built container images</div>
        </div>
      </div>

      {/* Machine Tier Selector */}
      <div className="bg-white border-2 border-ink p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-black uppercase tracking-tight text-ink">
            Machine Specification Profile
          </h2>
          <span className="text-xs font-bold uppercase text-ink/60">Selected: {selectedSpec}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: '2-core', title: 'Standard Node', spec: '2 cores • 8 GB RAM • 32 GB NVMe', label: 'Prototyping & Docs' },
            { id: '4-core', title: 'Performance Node', spec: '4 cores • 16 GB RAM • 32 GB NVMe', label: 'Fullstack & Tests (Recommended)' },
            { id: '8-core', title: 'Beast Node', spec: '8 cores • 32 GB RAM • 64 GB NVMe', label: 'Systems & ML Compiles' },
          ].map(spec => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpec(spec.id)}
              className={`p-4 border-2 text-left transition ${
                selectedSpec === spec.id
                  ? 'border-ink bg-highlight-yellow shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'
                  : 'border-ink/30 bg-paper-warm/50 hover:border-ink'
              }`}
            >
              <div className="font-display font-black text-base text-ink">{spec.title}</div>
              <div className="text-xs font-bold text-ink/70 mt-1">{spec.spec}</div>
              <div className="text-xs font-semibold text-ink/50 mt-2">{spec.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Workshop Environments */}
      <h2 className="text-xl font-display font-black uppercase tracking-tight text-ink mb-4">
        Active Workshop Instances
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {codespaces.map(cs => (
          <div
            key={cs.id}
            className="bg-white border-2 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-base text-ink">{cs.displayName}</span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-ink ${
                  cs.state === 'Running' ? 'bg-[#c8e6c9] text-[#1b5e20]' : 'bg-gray-200 text-gray-700'
                }`}>
                  {cs.state}
                </span>
              </div>
              <p className="text-xs text-ink/70 font-mono mb-3">{cs.repo} @ {cs.branch}</p>
              <div className="text-xs font-bold text-ink/60 space-y-1 mb-4">
                <div>Hardware: {cs.machine.type}</div>
                <div>Region: {cs.location}</div>
                <div>Collaborators: {cs.collaboratorsCount} active</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-3 border-t-2 border-ink/10">
              <button
                onClick={() => toggleState(cs.id)}
                className={`flex-1 py-2 font-bold uppercase text-xs border-2 border-ink transition ${
                  cs.state === 'Running'
                    ? 'bg-diff-red text-white shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none'
                    : 'bg-ship-green text-white shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {cs.state === 'Running' ? 'Shutdown Node' : 'Power Up Node'}
              </button>
              <button
                onClick={() => launchWorkshopSession(cs.displayName)}
                className="px-4 py-2 font-bold uppercase text-xs bg-ink text-paper-warm border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition"
              >
                Attach IDE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Starter Templates Deck */}
      <h2 className="text-xl font-display font-black uppercase tracking-tight text-ink mb-4">
        Ecosystem Templates
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {codespacesData.templates.map(tmpl => (
          <div key={tmpl.id} className="bg-white border-2 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-ink">{tmpl.title}</span>
                <span className="text-xs font-bold uppercase bg-highlight-yellow text-ink border border-ink px-2 py-0.5">
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-xs text-ink/70 mb-4">{tmpl.description}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-ink/20">
              <span className="text-xs font-mono text-ink/50">{tmpl.repo}</span>
              <button
                onClick={() => launchWorkshopSession(tmpl.title)}
                className="text-xs font-bold uppercase tracking-wider bg-white border-2 border-ink px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition"
              >
                One-Click Fork
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CodespacesPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicCodespaces /> : <StudioCodespaces />;
}
