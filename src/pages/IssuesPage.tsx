import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  CircleDot, CheckCircle2, MessageSquare, Search, Filter, 
  Sparkles, ThumbsUp, Tag, Plus, Flame, Clock, ArrowUpRight
} from 'lucide-react';
import issuesData from '../data/issues.json';

function ClassicIssues() {
  const [filterState, setFilterState] = useState<'open' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const filteredIssues = issuesData.issues.filter(issue => {
    if (issue.state !== filterState) return false;
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) && !issue.repo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedLabel && !issue.labels.some(l => l.name === selectedLabel)) {
      return false;
    }
    return true;
  });

  const allLabels = Array.from(new Set(issuesData.issues.flatMap(i => i.labels.map(l => l.name))));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xl font-semibold">
            <span className="text-white">Issues</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
              {issuesData.stats.openCount} Open
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Global issue tracker across your repositories and subscribed threads.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/react/react"
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>New Issue</span>
          </Link>
        </div>
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
            <CircleDot size={16} className="text-[#3fb950]" />
            <span>{issuesData.stats.openCount} Open</span>
          </button>
          <button
            onClick={() => setFilterState('closed')}
            className={`flex items-center space-x-1.5 font-medium transition ${
              filterState === 'closed' ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckCircle2 size={16} className="text-[#a371f7]" />
            <span>{issuesData.stats.closedCount} Closed</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search all issues or filter by repo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-paper placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          {selectedLabel && (
            <button
              onClick={() => setSelectedLabel(null)}
              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded hover:bg-gray-700 whitespace-nowrap"
            >
              Clear: {selectedLabel} ×
            </button>
          )}
        </div>
      </div>

      {/* Issue Table List */}
      <div className="border-x border-b border-gray-700 divide-y divide-gray-800 rounded-b-md bg-[#0d1117]">
        {filteredIssues.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No issues match the selected criteria.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} className="p-4 hover:bg-[#161b22]/60 transition flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                {issue.state === 'open' ? (
                  <CircleDot size={18} className="text-[#3fb950] mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 size={18} className="text-[#a371f7] mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white hover:text-blue-400 transition cursor-pointer">
                      {issue.title}
                    </span>
                    {issue.labels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => setSelectedLabel(label.name)}
                        style={{
                          backgroundColor: `${label.color}20`,
                          color: label.color,
                          borderColor: `${label.color}40`,
                        }}
                        className="text-xs px-2 py-0.5 rounded-full border font-medium hover:opacity-80 transition"
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                    <span className="font-mono text-gray-500">#{issue.number}</span>
                    <span>opened by</span>
                    <span className="text-gray-300 font-medium">{issue.author.login}</span>
                    <span>in</span>
                    <Link to="/react/react" className="text-blue-400 hover:underline">{issue.repo}</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-400 flex-shrink-0">
                {issue.assignee && (
                  <img
                    src={issue.assignee.avatarUrl}
                    alt={issue.assignee.login}
                    title={`Assigned to ${issue.assignee.login}`}
                    className="w-5 h-5 rounded-full border border-gray-700"
                  />
                )}
                {issue.commentsCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>{issue.commentsCount}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Label Quick Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400 flex items-center space-x-1">
          <Tag size={12} />
          <span>Quick Filter:</span>
        </span>
        {allLabels.slice(0, 8).map((label) => (
          <button
            key={label}
            onClick={() => setSelectedLabel(selectedLabel === label ? null : label)}
            className={`px-2.5 py-1 rounded-md border transition ${
              selectedLabel === label
                ? 'bg-blue-900/50 border-blue-500 text-blue-300'
                : 'bg-[#161b22] border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StudioIssues() {
  const [issues, setIssues] = useState(issuesData.issues);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [reactions, setReactions] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    issuesData.issues.forEach(i => { init[i.id] = i.reactionsCount; });
    return init;
  });
  const [reacted, setReacted] = useState<Record<number, boolean>>({});

  const toggleReaction = (id: number) => {
    setReacted(prev => {
      const isR = !!prev[id];
      setReactions(r => ({ ...r, [id]: (r[id] || 0) + (isR ? -1 : 1) }));
      return { ...prev, [id]: !isR };
    });
  };

  const filtered = issues.filter(issue => {
    if (activeCategory === 'all') return true;
    return issue.category === activeCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Triage Control
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Issues & RFCs
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Real-time problem reports, architecture proposals, and automated Copilot diagnoses.
          </p>
        </div>

        <Link
          to="/react/react"
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Plus size={16} />
          <span>Submit Proposal</span>
        </Link>
      </div>

      {/* Momentum Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>Triage Velocity</span>
            <Flame size={16} className="text-ship-green" />
          </div>
          <div className="text-3xl font-display font-black text-ink">{issuesData.stats.openCount}</div>
          <div className="text-xs text-ship-green font-bold mt-1">+14 resolved this cycle</div>
        </div>

        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>Copilot Assisted</span>
            <Sparkles size={16} className="text-ai-blue" />
          </div>
          <div className="text-3xl font-display font-black text-ai-blue">{issuesData.stats.aiAssisted}</div>
          <div className="text-xs text-ink/60 font-bold mt-1">Automated root-cause drafted</div>
        </div>

        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>Need Maintainer</span>
            <Clock size={16} className="text-review-amber" />
          </div>
          <div className="text-3xl font-display font-black text-review-amber">{issuesData.stats.triageNeeded}</div>
          <div className="text-xs text-ink/60 font-bold mt-1">Awaiting core review</div>
        </div>

        <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">
            <span>Total Shipped</span>
            <CheckCircle2 size={16} className="text-merge-purple" />
          </div>
          <div className="text-3xl font-display font-black text-merge-purple">{issuesData.stats.closedCount}</div>
          <div className="text-xs text-ink/60 font-bold mt-1">Historical fixes & features</div>
        </div>
      </div>

      {/* Studio Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'bug', label: 'Bugs' },
          { id: 'rfc', label: 'RFC Proposals' },
          { id: 'perf', label: 'Performance' },
          { id: 'feature', label: 'Features' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-1.5 font-bold uppercase text-xs tracking-wider border-2 border-ink transition ${
              activeCategory === tab.id
                ? 'bg-ink text-paper-warm shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                : 'bg-white text-ink hover:bg-highlight-yellow'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Studio Issue Cards */}
      <div className="space-y-4">
        {filtered.map((issue) => (
          <div
            key={issue.id}
            className="bg-white border-2 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:-translate-y-0.5 transition"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-black bg-ink text-paper-warm px-2 py-0.5">
                    #{issue.number}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-ink ${
                    issue.category === 'bug' ? 'bg-[#ffcdd2] text-[#b71c1c]' :
                    issue.category === 'rfc' ? 'bg-highlight-yellow text-ink' :
                    issue.category === 'perf' ? 'bg-[#e1bee7] text-[#4a148c]' :
                    'bg-[#c8e6c9] text-[#1b5e20]'
                  }`}>
                    {issue.category.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-ink/60">in {issue.repo}</span>
                </div>

                <h3 className="text-xl font-display font-black text-ink mb-2">
                  {issue.title}
                </h3>

                <p className="text-sm text-ink/80 mb-4 line-clamp-2">
                  {issue.body}
                </p>

                {/* Copilot Diagnosis Capsule */}
                <div className="bg-paper-warm border border-ink/30 p-3 mb-4 flex items-start space-x-2">
                  <Sparkles size={16} className="text-ai-blue flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-ink uppercase tracking-wide mr-1.5">Copilot Diagnosis:</span>
                    <span className="text-ink/80">{issue.aiSummary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {issue.labels.map((l) => (
                    <span
                      key={l.id}
                      className="text-xs font-semibold px-2 py-0.5 border border-ink/40 bg-gray-50 text-ink"
                    >
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Column */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-2 md:pt-0">
                <button
                  onClick={() => toggleReaction(issue.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 border-2 border-ink text-xs font-bold transition ${
                    reacted[issue.id]
                      ? 'bg-ship-green text-white shadow-none'
                      : 'bg-white hover:bg-highlight-yellow shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                  }`}
                >
                  <ThumbsUp size={14} />
                  <span>{reactions[issue.id] || 0}</span>
                </button>

                <div className="flex items-center space-x-2 text-xs font-bold text-ink/60">
                  <MessageSquare size={14} />
                  <span>{issue.commentsCount} comments</span>
                </div>

                <Link
                  to="/react/react"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-ink hover:text-ai-blue transition underline decoration-2 underline-offset-2"
                >
                  <span>Inspect</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IssuesPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicIssues /> : <StudioIssues />;
}
