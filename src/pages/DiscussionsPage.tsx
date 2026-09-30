import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  MessageSquare, ChevronUp, CheckCircle, Pin, Search, 
  Sparkles, Megaphone, Lightbulb, HelpCircle, Plus 
} from 'lucide-react';
import discussionsData from '../data/discussions.json';

function ClassicDiscussions() {
  const { addToast } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [upvotes, setUpvotes] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    discussionsData.discussions.forEach(d => { init[d.id] = d.upvotes; });
    return init;
  });
  const [hasUpvoted, setHasUpvoted] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    discussionsData.discussions.forEach(d => { if (d.isUpvoted) init[d.id] = true; });
    return init;
  });

  const toggleUpvote = (id: number) => {
    setHasUpvoted(prev => {
      const isUp = !prev[id];
      setUpvotes(u => ({ ...u, [id]: (u[id] || 0) + (isUp ? 1 : -1) }));
      addToast(isUp ? 'Upvoted discussion' : 'Removed upvote', 'info');
      return { ...prev, [id]: isUp };
    });
  };

  const filteredDiscussions = discussionsData.discussions.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(q) && !item.previewText.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Discussions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Community conversations, architecture proposals, and Q&A for {discussionsData.repo}.
          </p>
        </div>
        <button
          onClick={() => addToast('Opening New Discussion flow', 'info')}
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus size={16} />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161b22] border border-gray-700 rounded-t-md p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          {discussionsData.categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                selectedCategory === c.name
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-paper placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Discussions List */}
      <div className="border-x border-b border-gray-700 divide-y divide-gray-800 rounded-b-md bg-[#0d1117]">
        {filteredDiscussions.map((d) => {
          const isUp = !!hasUpvoted[d.id];

          return (
            <div key={d.id} className="p-4 hover:bg-[#161b22]/50 transition flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                {/* Upvote Pill */}
                <button
                  onClick={() => toggleUpvote(d.id)}
                  className={`flex flex-col items-center px-2 py-1.5 rounded border text-xs font-semibold flex-shrink-0 transition ${
                    isUp
                      ? 'bg-blue-950 border-blue-600 text-blue-300'
                      : 'bg-[#161b22] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <ChevronUp size={16} />
                  <span>{upvotes[d.id] || 0}</span>
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {d.pinned && (
                      <span className="text-xs bg-amber-950 border border-amber-800 text-amber-300 px-1.5 py-0.5 rounded flex items-center space-x-1">
                        <Pin size={10} />
                        <span>Pinned</span>
                      </span>
                    )}
                    <span className="font-semibold text-white hover:text-blue-400 transition cursor-pointer text-base">
                      {d.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-medium">
                      {d.category}
                    </span>
                    {d.isAnswered && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-950 border border-green-800 text-green-300 flex items-center space-x-1 font-medium">
                        <CheckCircle size={11} />
                        <span>Answered</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-3xl">
                    {d.previewText}
                  </p>

                  <div className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
                    <img src={d.author.avatarUrl} alt={d.author.login} className="w-4 h-4 rounded-full" />
                    <span className="text-gray-300 font-medium">{d.author.login}</span>
                    <span className="bg-gray-800 text-gray-400 px-1.5 py-0.2 rounded text-[10px]">{d.author.badge}</span>
                    <span>•</span>
                    <span>{d.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-xs text-gray-400 flex-shrink-0">
                <MessageSquare size={14} />
                <span>{d.answersCount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudioDiscussions() {
  const { addToast } = useAppStore();
  const [upvotes, setUpvotes] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    discussionsData.discussions.forEach(d => { init[d.id] = d.upvotes; });
    return init;
  });
  const [hasUpvoted, setHasUpvoted] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    discussionsData.discussions.forEach(d => { if (d.isUpvoted) init[d.id] = true; });
    return init;
  });

  const toggleUpvote = (id: number, title: string) => {
    setHasUpvoted(prev => {
      const next = !prev[id];
      setUpvotes(u => ({ ...u, [id]: (u[id] || 0) + (next ? 1 : -1) }));
      addToast(next ? `Endorsed RFC: ${title}` : `Withdrew endorsement`, 'success');
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Open Conversations
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Community Voice
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Ask questions, share ideas, vote on proposals, and see what the community is saying.
          </p>
        </div>

        <button
          onClick={() => addToast('Opening a new discussion — what\'s on your mind?', 'info')}
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Sparkles size={16} />
          <span>Start a Discussion</span>
        </button>
      </div>

      {/* Highlighted Top Discussion Card */}
      <div className="bg-white border-2 border-ink p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-highlight-yellow border border-ink">
                Pinned by Maintainers
              </span>
              <span className="text-xs font-bold text-ink/60">{discussionsData.discussions[0].createdAt}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-ink uppercase tracking-tight mb-2">
              {discussionsData.discussions[0].title}
            </h2>
            <p className="text-sm text-ink/80 font-medium mb-4">
              {discussionsData.discussions[0].previewText}
            </p>
            <div className="flex items-center space-x-3 text-xs font-bold">
              <img src={discussionsData.discussions[0].author.avatarUrl} alt="" className="w-5 h-5 rounded-full border border-ink" />
              <span>{discussionsData.discussions[0].author.login} ({discussionsData.discussions[0].author.badge})</span>
              <span>•</span>
              <span>{discussionsData.discussions[0].answersCount} Replies</span>
            </div>
          </div>

          <button
            onClick={() => toggleUpvote(discussionsData.discussions[0].id, discussionsData.discussions[0].title)}
            className={`px-6 py-4 font-display font-black uppercase tracking-wider text-sm border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center space-x-2 flex-shrink-0 ${
              hasUpvoted[discussionsData.discussions[0].id]
                ? 'bg-ship-green text-white'
                : 'bg-highlight-yellow text-ink'
            }`}
          >
            <ChevronUp size={20} />
            <span>👍 Agree ({upvotes[discussionsData.discussions[0].id]})</span>
          </button>
        </div>
      </div>

      {/* Discussion Voice Cards */}
      <div className="space-y-4">
        {discussionsData.discussions.map((d) => {
          const isUp = !!hasUpvoted[d.id];

          return (
            <div
              key={d.id}
              className="bg-white border-2 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:-translate-y-0.5 transition"
            >
              <div className="flex items-start space-x-4 flex-1">
                {/* Voting Control */}
                <button
                  onClick={() => toggleUpvote(d.id, d.title)}
                  className={`p-3 border-2 border-ink flex flex-col items-center justify-center transition flex-shrink-0 ${
                    isUp
                      ? 'bg-ship-green text-white shadow-none'
                      : 'bg-paper-warm text-ink hover:bg-highlight-yellow shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                  }`}
                >
                  <ChevronUp size={20} />
                  <span className="font-display font-black text-sm">{upvotes[d.id]}</span>
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-ink bg-paper-warm">
                      {d.category}
                    </span>
                    {d.isAnswered && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-ink bg-[#c8e6c9] text-[#1b5e20]">
                        ✓ Resolved
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-black text-ink mb-1">
                    {d.title}
                  </h3>

                  <p className="text-xs text-ink/70 font-medium line-clamp-2 max-w-2xl mb-2">
                    {d.previewText}
                  </p>

                  <div className="flex items-center space-x-2 text-xs font-bold text-ink/60">
                    <img src={d.author.avatarUrl} alt="" className="w-4 h-4 rounded-full border border-ink" />
                    <span>{d.author.login}</span>
                    <span>•</span>
                    <span>{d.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-ink/80 flex-shrink-0 pt-2 md:pt-0">
                <MessageSquare size={16} />
                <span>{d.answersCount} replies</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DiscussionsPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicDiscussions /> : <StudioDiscussions />;
}
