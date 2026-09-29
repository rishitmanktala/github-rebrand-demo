import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Package, Copy, Check, Download, Layers, 
  ExternalLink, Sparkles, Terminal, Box, ArrowUpRight 
} from 'lucide-react';
import packagesData from '../data/packages.json';

function ClassicPackages() {
  const { addToast } = useAppStore();
  const [selectedEcosystem, setSelectedEcosystem] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCommand = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    addToast(`Copied install command: ${cmd}`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPackages = packagesData.packages.filter(p => {
    if (selectedEcosystem !== 'All' && p.ecosystem !== selectedEcosystem) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Packages</h1>
          <p className="text-gray-400 text-sm mt-1">
            Package registry hosting npm modules, Docker containers, Maven artifacts, and Python wheels.
          </p>
        </div>
        <button
          onClick={() => addToast('Opening Package Publish Guide', 'info')}
          className="bg-[#21262d] hover:bg-gray-700 text-gray-200 border border-gray-700 px-3.5 py-1.5 rounded-md text-sm font-medium transition"
        >
          Publish a package
        </button>
      </div>

      {/* Ecosystem Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {packagesData.ecosystemFilters.map(eco => (
          <button
            key={eco}
            onClick={() => setSelectedEcosystem(eco)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              selectedEcosystem === eco
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-[#161b22] border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            {eco}
          </button>
        ))}
      </div>

      {/* Package Registry List */}
      <div className="border border-gray-700 rounded-md bg-[#0d1117] divide-y divide-gray-800">
        {filteredPackages.map(pkg => (
          <div key={pkg.id} className="p-5 hover:bg-[#161b22]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-white text-base hover:text-blue-400 transition cursor-pointer">
                  {pkg.name}
                </span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">
                  {pkg.latestVersion}
                </span>
                <span className="text-xs bg-blue-950 border border-blue-800 text-blue-300 px-2 py-0.5 rounded">
                  {pkg.ecosystem}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-3 max-w-2xl">{pkg.description}</p>

              {/* Install Snippet */}
              <div className="bg-[#161b22] border border-gray-700 rounded px-3 py-1.5 flex items-center justify-between max-w-xl text-xs font-mono text-gray-300">
                <span className="truncate">{pkg.installCommand}</span>
                <button
                  onClick={() => copyCommand(pkg.id, pkg.installCommand)}
                  className="text-gray-400 hover:text-white transition ml-2 flex-shrink-0"
                  title="Copy command"
                >
                  {copiedId === pkg.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                <span>Repository: <Link to="/react/react" className="text-blue-400 hover:underline">{pkg.repository}</Link></span>
                <span>•</span>
                <span>{pkg.downloadsTotal} total downloads</span>
                <span>•</span>
                <span>{pkg.license} License</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-xs text-gray-400 block">Published {pkg.publishedAt}</span>
              <span className="text-xs text-green-400 font-medium">{pkg.downloadsThisMonth} this month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioPackages() {
  const { addToast } = useAppStore();
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const handleCopy = (id: string, cmd: string, name: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(prev => ({ ...prev, [id]: true }));
    addToast(`Copied install command for ${name}!`, 'success');
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Artifact Distribution
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Package Registry
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Global distribution network for modern build targets: npm packages, OCI containers, and Rust wheels.
          </p>
        </div>

        <button
          onClick={() => addToast('Opening Package Publisher Config', 'info')}
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Sparkles size={16} />
          <span>Publish Release</span>
        </button>
      </div>

      {/* Package Deck Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {packagesData.packages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white border-2 border-ink p-6 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between hover:-translate-y-0.5 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-highlight-yellow border border-ink px-2 py-0.5 inline-block mb-1">
                    {pkg.ecosystem}
                  </span>
                  <h3 className="font-display font-black text-2xl text-ink leading-tight">
                    {pkg.name}
                  </h3>
                </div>
                <span className="font-mono text-xs font-black bg-ink text-paper-warm px-2 py-0.5">
                  {pkg.latestVersion}
                </span>
              </div>

              <p className="text-xs text-ink/80 font-medium mb-4">
                {pkg.description}
              </p>

              {/* High-Contrast Copyable Install Capsule */}
              <div className="bg-paper-warm border-2 border-ink p-3 mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-ink font-bold truncate mr-2">
                  {pkg.installCommand}
                </span>
                <button
                  onClick={() => handleCopy(pkg.id, pkg.installCommand, pkg.name)}
                  className={`p-2 border border-ink text-xs font-black uppercase transition flex-shrink-0 ${
                    copied[pkg.id]
                      ? 'bg-ship-green text-white'
                      : 'bg-white hover:bg-highlight-yellow text-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                  }`}
                  title="Copy command"
                >
                  {copied[pkg.id] ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {pkg.tags.map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase bg-gray-100 border border-ink/40 px-2 py-0.5">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t-2 border-ink/10 flex items-center justify-between text-xs font-bold text-ink/70">
              <div className="flex items-center space-x-2">
                <Download size={14} />
                <span>{pkg.downloadsTotal} Downloads</span>
              </div>
              <Link to="/react/react" className="hover:underline flex items-center space-x-1">
                <span>{pkg.repository}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicPackages /> : <StudioPackages />;
}
