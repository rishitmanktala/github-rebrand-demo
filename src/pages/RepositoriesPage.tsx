import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  BookMarked, Star, GitFork, Search, Plus, 
  Sparkles, Shield, ArrowUpRight, Lock, Globe 
} from 'lucide-react';
import reposData from '../data/repositories.json';

function ClassicRepositories() {
  const { addToast, setActiveModal, starredRepos, toggleStarRepo } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const filteredRepos = reposData.repositories.filter(repo => {
    if (selectedType === 'public' && repo.visibility !== 'public') return false;
    if (selectedType === 'private' && repo.visibility !== 'private') return false;
    if (selectedType === 'forks' && !repo.isFork) return false;
    if (selectedLanguage !== 'all' && repo.language !== selectedLanguage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!repo.name.toLowerCase().includes(q) && !repo.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const languages = Array.from(new Set(reposData.repositories.map(r => r.language)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xl font-semibold">
            <span className="text-white">Repositories</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
              {reposData.stats.totalCount}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Repositories owned or contributed to by {reposData.user}.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('create-repo')}
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus size={16} />
          <span>New</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Find a repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-paper placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#161b22] border border-gray-700 rounded-md px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-blue-500"
          >
            <option value="all">Type: All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="forks">Forks</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#161b22] border border-gray-700 rounded-md px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-blue-500"
          >
            <option value="all">Language: All</option>
            {languages.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Repositories List */}
      <div className="border border-gray-700 rounded-md bg-[#0d1117] divide-y divide-gray-800">
        {filteredRepos.map((repo) => {
          const repoKey = `${reposData.user}/${repo.name}`;
          const isStarred = Boolean(starredRepos[repoKey] || (starredRepos[repo.name] !== undefined ? starredRepos[repo.name] : repo.isStarred));
          const starCount = isStarred ? (repo.isStarred ? repo.stars : repo.stars + 1) : (repo.isStarred ? repo.stars - 1 : repo.stars);
          
          const handleStar = () => {
            toggleStarRepo(repoKey);
            addToast(isStarred ? `Unstarred ${repo.name}` : `Starred ${repo.name}!`, 'success');
          };

          return (
            <div key={repo.id} className="p-5 hover:bg-[#161b22]/40 transition flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Link to="/react/react" className="text-blue-400 hover:underline text-lg font-semibold">
                    {repo.name}
                  </Link>
                  <span className="text-xs border border-gray-700 text-gray-400 px-2 py-0.2 rounded-full">
                    {repo.visibility}
                  </span>
                  {repo.isFork && (
                    <span className="text-xs text-gray-500">Forked from {repo.forkedFrom}</span>
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-3 max-w-3xl">{repo.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                    <span className="text-gray-300">{repo.language}</span>
                  </div>

                  {repo.stars > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star size={13} className={isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
                      <span>{starCount.toLocaleString()}</span>
                    </div>
                  )}

                  {repo.forks > 0 && (
                    <div className="flex items-center space-x-1">
                      <GitFork size={13} />
                      <span>{repo.forks.toLocaleString()}</span>
                    </div>
                  )}

                  <span>Updated {repo.updatedAt}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handleStar}
                  className={`border px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center space-x-1.5 ${
                    isStarred 
                      ? 'bg-[#21262d] border-gray-600 text-yellow-400' 
                      : 'bg-[#21262d] hover:bg-gray-700 text-gray-200 border-gray-700'
                  }`}
                >
                  <Star size={13} className={isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
                  <span>{isStarred ? 'Starred' : 'Star'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudioRepositories() {
  const { addToast, setActiveModal, starredRepos, toggleStarRepo } = useAppStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Source Repositories
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Living Portfolio
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Component design systems, high-speed CLI parsers, and fullstack applications by {reposData.user}.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('create-repo')}
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Repository</span>
        </button>
      </div>

      {/* High-Contrast Living Portfolio Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {reposData.repositories.map(repo => {
          const repoKey = `${reposData.user}/${repo.name}`;
          const isStarred = Boolean(starredRepos[repoKey] || (starredRepos[repo.name] !== undefined ? starredRepos[repo.name] : repo.isStarred));
          const starCount = isStarred ? (repo.isStarred ? repo.stars : repo.stars + 1) : (repo.isStarred ? repo.stars - 1 : repo.stars);
          
          const handleStar = () => {
            toggleStarRepo(repoKey);
            addToast(isStarred ? `Unstarred ${repo.name}` : `Starred ${repo.name}!`, 'success');
          };

          return (
            <div
              key={repo.id}
              className="bg-white border-2 border-ink p-6 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between hover:-translate-y-0.5 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-highlight-yellow border border-ink px-2 py-0.5">
                        {repo.visibility}
                      </span>
                      <span className="text-xs font-bold text-ink/60 font-mono">
                        Health {repo.healthScore}%
                      </span>
                    </div>
                    <Link
                      to="/react/react"
                      className="font-display font-black text-2xl text-ink hover:underline block leading-tight"
                    >
                      {repo.name}
                    </Link>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black uppercase px-2 py-0.5 border border-ink bg-paper-warm">
                      {repo.language}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ink/80 font-medium mb-4 line-clamp-3">
                  {repo.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {repo.topics.map(topic => (
                    <span key={topic} className="text-[10px] font-bold uppercase bg-gray-100 border border-ink/40 px-2 py-0.5">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t-2 border-ink/10 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-3 text-ink/70">
                  <button
                    onClick={handleStar}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 border-2 border-ink transition rounded-sm shadow-[1px_1px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px ${
                      isStarred ? 'bg-highlight-yellow text-ink' : 'bg-white text-ink hover:bg-gray-100'
                    }`}
                    title="Toggle Star"
                  >
                    <Star size={13} className={isStarred ? "fill-ink text-ink" : "text-ink"} />
                    <span>{starCount.toLocaleString()}</span>
                  </button>
                  <span>•</span>
                  <span>branch: {repo.activeBranch}</span>
                </div>

                <Link
                  to="/react/react"
                  className="px-3 py-1.5 bg-ink text-paper-warm font-display font-black uppercase text-xs border border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center space-x-1"
                >
                  <span>Inspect</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RepositoriesPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicRepositories /> : <StudioRepositories />;
}
