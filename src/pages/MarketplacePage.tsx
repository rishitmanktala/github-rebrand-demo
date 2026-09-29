import React, { useState } from 'react';
import { useAppStore } from '../store';
import { 
  Search, Star, CheckCircle, ShieldCheck, Download, 
  Sparkles, Check, Package, ExternalLink, ArrowRight 
} from 'lucide-react';
import marketplaceData from '../data/marketplace.json';

function ClassicMarketplace() {
  const { addToast } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedItems, setInstalledItems] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    marketplaceData.items.forEach(item => {
      if (item.installed) init[item.id] = true;
    });
    return init;
  });

  const toggleInstall = (id: string, name: string) => {
    setInstalledItems(prev => {
      const next = !prev[id];
      addToast(next ? `Installed ${name} to repository` : `Removed ${name}`, 'success');
      return { ...prev, [id]: next };
    });
  };

  const filteredItems = marketplaceData.items.filter(item => {
    if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = item.name.toLowerCase().includes(q);
      const inDesc = item.shortDescription.toLowerCase().includes(q);
      const inPub = item.publisher.name.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inPub) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-semibold text-white">Marketplace</h1>
        <p className="text-gray-400 text-sm mt-1">
          Extend your workflow with GitHub Actions, Apps, and Copilot extensions from verified creators.
        </p>

        {/* Search */}
        <div className="mt-4 max-w-xl relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search tools, actions, and integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-700 rounded-md pl-9 pr-4 py-2 text-sm text-paper placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Category Sidebar */}
        <div className="w-full md:w-60 flex-shrink-0">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h2>
          <div className="space-y-1">
            {marketplaceData.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600/20 text-blue-400 font-medium'
                    : 'text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-800 pt-4">
            <div className="text-xs text-gray-400 font-semibold mb-2">PUBLISHER TYPE</div>
            <div className="text-xs text-gray-400 flex items-center space-x-1.5 py-1">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>Verified Creator Badge</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Featured Banner */}
          {selectedCategory === 'All Categories' && !searchQuery && (
            <div className="bg-[#161b22] border border-gray-700 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="inline-block bg-blue-950 border border-blue-800 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium mb-3">
                  Featured Extension
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{marketplaceData.featuredItem.name}</h3>
                <p className="text-sm text-gray-300 mb-4">{marketplaceData.featuredItem.fullDescription}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center text-amber-400">
                    <Star size={14} className="fill-amber-400 mr-1" />
                    {marketplaceData.featuredItem.rating} ({marketplaceData.featuredItem.ratingCount})
                  </span>
                  <span>{marketplaceData.featuredItem.installs} installs</span>
                  <span className="text-green-400 font-semibold">{marketplaceData.featuredItem.pricing}</span>
                </div>
              </div>

              <button
                onClick={() => toggleInstall(marketplaceData.featuredItem.id, marketplaceData.featuredItem.name)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center space-x-1.5 flex-shrink-0 ${
                  installedItems[marketplaceData.featuredItem.id]
                    ? 'bg-gray-800 text-gray-200 border border-gray-600'
                    : 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-sm'
                }`}
              >
                {installedItems[marketplaceData.featuredItem.id] ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span>Added to Org</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Install Action</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#161b22] border border-gray-700 hover:border-gray-500 rounded-lg p-5 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center font-bold text-white">
                        <Package size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-base leading-snug">{item.name}</h4>
                        <div className="flex items-center space-x-1 text-xs text-gray-400 mt-0.5">
                          <span>By {item.publisher.name}</span>
                          {item.publisher.verified && (
                            <ShieldCheck size={13} className="text-blue-400" title="Verified Publisher" />
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                      {item.pricing}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{item.shortDescription}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-amber-400">
                        <Star size={12} className="fill-amber-400 mr-1" />
                        {item.rating}
                      </span>
                      <span>{item.installs}</span>
                    </div>

                    <button
                      onClick={() => toggleInstall(item.id, item.name)}
                      className={`text-xs px-3 py-1 rounded font-medium transition ${
                        installedItems[item.id]
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-[#238636] hover:bg-[#2ea043] text-white'
                      }`}
                    >
                      {installedItems[item.id] ? 'Installed' : 'Set up'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioMarketplace() {
  const { addToast } = useAppStore();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [installed, setInstalled] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    marketplaceData.items.forEach(i => { if (i.installed) init[i.id] = true; });
    return init;
  });

  const toggleStudioInstall = (id: string, name: string) => {
    setInstalled(prev => {
      const isInst = !prev[id];
      addToast(isInst ? `Installed ${name} to your Workshop` : `Uninstalled ${name}`, 'success');
      return { ...prev, [id]: isInst };
    });
  };

  const filtered = marketplaceData.items.filter(item => {
    if (selectedTag === 'all') return true;
    return item.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()) || item.type === selectedTag;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Tooling Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Extend the Workshop
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Plugins, CI automation recipes, and intelligent agent workflows built by the open-source guild.
          </p>
        </div>

        <button
          onClick={() => addToast('Opened Publisher Portal', 'info')}
          className="bg-white text-ink px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Sparkles size={16} className="text-ai-blue" />
          <span>Publish Tool</span>
        </button>
      </div>

      {/* Featured Spotlight Card */}
      <div className="bg-white border-2 border-ink p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="inline-block bg-ai-blue text-white font-bold uppercase tracking-wider text-xs px-2.5 py-0.5 border border-ink mb-3">
              Staff Pick: Autonomous Agent
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-ink uppercase tracking-tight mb-2">
              {marketplaceData.featuredItem.name}
            </h2>
            <p className="text-sm text-ink/80 font-medium mb-4 max-w-2xl">
              {marketplaceData.featuredItem.fullDescription}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
              <span className="bg-highlight-yellow border border-ink px-2 py-0.5">
                ★ {marketplaceData.featuredItem.rating} Rating
              </span>
              <span className="bg-paper-warm border border-ink px-2 py-0.5">
                {marketplaceData.featuredItem.installs} Active Workshops
              </span>
              <span className="bg-[#c8e6c9] text-[#1b5e20] border border-ink px-2 py-0.5">
                {marketplaceData.featuredItem.pricing}
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleStudioInstall(marketplaceData.featuredItem.id, marketplaceData.featuredItem.name)}
            className={`px-6 py-4 font-display font-black uppercase tracking-wider text-sm border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center space-x-2 flex-shrink-0 ${
              installed[marketplaceData.featuredItem.id]
                ? 'bg-ship-green text-white'
                : 'bg-ink text-paper-warm'
            }`}
          >
            {installed[marketplaceData.featuredItem.id] ? (
              <>
                <Check size={18} />
                <span>Installed to Workshop</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Install to Workshop</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tag Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Capabilities' },
          { id: 'copilot-extension', label: 'Copilot Agents' },
          { id: 'action', label: 'Actions' },
          { id: 'security', label: 'Security' },
          { id: 'docker', label: 'Containers' },
        ].map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            className={`px-4 py-1.5 font-bold uppercase text-xs tracking-wider border-2 border-ink transition ${
              selectedTag === tag.id
                ? 'bg-ink text-paper-warm shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                : 'bg-white text-ink hover:bg-highlight-yellow'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* High-Contrast Tool Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white border-2 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between hover:-translate-y-0.5 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-ink inline-block mb-1.5 ${item.badgeColor} ${item.badgeColor.includes('yellow') || item.badgeColor.includes('paper') ? 'text-ink' : 'text-white'}`}>
                    {item.category}
                  </span>
                  <h3 className="text-xl font-display font-black text-ink">{item.name}</h3>
                  <div className="text-xs font-bold text-ink/60 mt-0.5 flex items-center space-x-1">
                    <span>{item.publisher.name}</span>
                    {item.publisher.verified && <ShieldCheck size={14} className="text-ai-blue" />}
                  </div>
                </div>

                <span className="text-xs font-display font-black bg-highlight-yellow border border-ink px-2 py-1 uppercase">
                  {item.pricing}
                </span>
              </div>

              <p className="text-xs text-ink/80 font-medium mb-4 line-clamp-3">
                {item.shortDescription}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tags.map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase bg-paper-warm border border-ink/40 px-2 py-0.5">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-ink/10">
              <div className="text-xs font-bold text-ink/70">
                ★ {item.rating} • {item.installs}
              </div>

              <button
                onClick={() => toggleStudioInstall(item.id, item.name)}
                className={`px-4 py-2 font-bold uppercase text-xs border-2 border-ink transition ${
                  installed[item.id]
                    ? 'bg-ship-green text-white shadow-none'
                    : 'bg-ink text-paper-warm shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {installed[item.id] ? 'Added' : 'Add to Workshop'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicMarketplace /> : <StudioMarketplace />;
}
