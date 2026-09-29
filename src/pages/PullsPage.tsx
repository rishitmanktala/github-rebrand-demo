import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  GitPullRequest, CheckCircle2, XCircle, Clock, Search, 
  Sparkles, Check, MessageSquare, ArrowRight, ShieldCheck, 
  FileDiff, Plus 
} from 'lucide-react';
import pullsData from '../data/pulls.json';

function ClassicPulls() {
  const [filterState, setFilterState] = useState<'open' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPulls = pullsData.pulls.filter(pr => {
    if (pr.state !== filterState) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!pr.title.toLowerCase().includes(q) && !pr.repo.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xl font-semibold">
            <span className="text-white">Pull Requests</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
              {pullsData.stats.openCount} Open
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Global review queue across your subscribed repositories and teams.
          </p>
        </div>
        <Link
          to="/react/react"
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus size={16} />
          <span>New Pull Request</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161b22] border border-gray-700 rounded-t-md p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => setFilterState('open')}
            className={`flex items-center space-x-1.5 font-medium transition ${
              filterState === 'open' ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <GitPullRequest size={16} className="text-[#3fb950]" />
            <span>{pullsData.stats.openCount} Open</span>
          </button>
          <button
            onClick={() => setFilterState('closed')}
            className={`flex items-center space-x-1.5 font-medium transition ${
              filterState === 'closed' ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckCircle2 size={16} className="text-[#a371f7]" />
            <span>{pullsData.stats.closedCount} Closed</span>
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Filter pull requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-paper placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Pulls Queue Table */}
      <div className="border-x border-b border-gray-700 divide-y divide-gray-800 rounded-b-md bg-[#0d1117]">
        {filteredPulls.map((pr) => (
          <div key={pr.id} className="p-4 hover:bg-[#161b22]/50 transition flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <GitPullRequest size={18} className={`mt-0.5 flex-shrink-0 ${
                pr.state === 'open' ? 'text-[#3fb950]' : 'text-[#a371f7]'
              }`} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={pr.number === 28271 ? '/react/react/pull/28271' : '/react/react'}
                    className="font-semibold text-white hover:text-blue-400 transition"
                  >
                    {pr.title}
                  </Link>

                  {pr.labels.map(l => (
                    <span
                      key={l.id}
                      style={{ backgroundColor: `${l.color}20`, color: l.color, borderColor: `${l.color}40` }}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                    >
                      {l.name}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-gray-500">#{pr.number}</span>
                  <span>by</span>
                  <span className="text-gray-300 font-medium">{pr.author.login}</span>
                  <span>in</span>
                  <Link to="/react/react" className="text-blue-400 hover:underline">{pr.repo}</Link>
                  <span>•</span>
                  <span>+{pr.additions} -{pr.deletions} lines</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-gray-400 flex-shrink-0">
              <div className="flex items-center space-x-1">
                {pr.ciStatus === 'success' ? (
                  <CheckCircle2 size={14} className="text-[#3fb950]" title="All CI checks passed" />
                ) : (
                  <Clock size={14} className="text-[#d29922]" title="CI checks pending" />
                )}
                <span>{pr.ciChecks.passed}/{pr.ciChecks.total}</span>
              </div>

              {pr.commentsCount > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare size={14} />
                  <span>{pr.commentsCount}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioPulls() {
  const { addToast } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'needs_review' | 'ready'>('all');

  const filteredPulls = pullsData.pulls.filter(pr => {
    if (filter === 'needs_review') return pr.reviewStatus === 'review_required';
    if (filter === 'ready') return pr.reviewStatus === 'approved';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Peer Review Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Flow Review Stream
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Intent-grouped diffs, automated architectural summaries, and high-velocity approvals.
          </p>
        </div>

        <Link
          to="/react/react"
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <GitPullRequest size={16} />
          <span>Draft Pull Request</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Reviews' },
          { id: 'needs_review', label: 'Needs My Review' },
          { id: 'ready', label: 'Ready to Ship' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-1.5 font-bold uppercase text-xs tracking-wider border-2 border-ink transition ${
              filter === tab.id
                ? 'bg-ink text-paper-warm shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                : 'bg-white text-ink hover:bg-highlight-yellow'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pull Cards */}
      <div className="space-y-4">
        {filteredPulls.map(pr => (
          <div
            key={pr.id}
            className="bg-white border-2 border-ink p-6 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:-translate-y-0.5 transition"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-black bg-ink text-paper-warm px-2 py-0.5">
                    #{pr.number}
                  </span>
                  <span className="text-xs font-bold text-ink/70">{pr.repo}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-ink ${
                    pr.reviewStatus === 'approved' ? 'bg-[#c8e6c9] text-[#1b5e20]' : 'bg-highlight-yellow text-ink'
                  }`}>
                    {pr.reviewStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <Link
                  to={pr.number === 28271 ? '/react/react/pull/28271' : '/react/react'}
                  className="font-display font-black text-2xl text-ink hover:underline block mb-2"
                >
                  {pr.title}
                </Link>

                {/* Copilot Architectural Insight */}
                <div className="bg-paper-warm border border-ink/30 p-3 mb-4 flex items-start space-x-2">
                  <Sparkles size={16} className="text-ai-blue flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-ink uppercase tracking-wide mr-1.5">Copilot Intent Summary:</span>
                    <span className="text-ink/80">{pr.aiSummary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-ink/70">
                  <div className="flex items-center space-x-1.5">
                    <img src={pr.author.avatarUrl} alt="" className="w-4 h-4 rounded-full border border-ink" />
                    <span>{pr.author.login}</span>
                  </div>
                  <span>•</span>
                  <span className="text-ship-green">+{pr.additions}</span>
                  <span className="text-diff-red">-{pr.deletions}</span>
                  <span>•</span>
                  <span>{pr.changedFiles} files changed</span>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 flex-shrink-0 pt-3 md:pt-0">
                <Link
                  to={pr.number === 28271 ? '/react/react/pull/28271' : '/react/react'}
                  className="px-5 py-2.5 bg-ink text-paper-warm font-display font-black uppercase tracking-wider text-xs border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center space-x-2"
                >
                  <span>Enter Review</span>
                  <ArrowRight size={14} />
                </Link>

                <div className="text-xs font-bold text-ink/60">
                  {pr.ciChecks.passed}/{pr.ciChecks.total} checks passing
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PullsPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicPulls /> : <StudioPulls />;
}
