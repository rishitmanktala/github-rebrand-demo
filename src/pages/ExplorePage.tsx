import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Star, GitFork, Compass, Sparkles, TrendingUp, BookOpen, 
  ExternalLink, Layers, ArrowUpRight, Flame, Heart 
} from 'lucide-react';
import exploreData from '../data/explore.json';

function ClassicExplore() {
  const { addToast } = useAppStore();
  const [timeframe, setTimeframe] = useState<'today' | 'this_week' | 'this_month'>('this_week');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [starredRepos, setStarredRepos] = useState<Record<string, boolean>>({});

  const toggleStar = (repoKey: string) => {
    setStarredRepos(prev => {
      const isStarred = !prev[repoKey];
      addToast(isStarred ? `Starred ${repoKey}` : `Unstarred ${repoKey}`, 'success');
      return { ...prev, [repoKey]: isStarred };
    });
  };

  const filteredTrending = exploreData.trending.filter(item => {
    if (selectedLanguage !== 'All Languages' && item.language !== selectedLanguage) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Explore</h1>
          <p className="text-gray-400 text-sm mt-1">
            See what the GitHub community is most excited about today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Pills */}
          <div className="bg-[#161b22] border border-gray-700 rounded-md p-1 flex items-center text-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: 'this_week', label: 'This week' },
              { id: 'this_month', label: 'This month' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as any)}
                className={`px-3 py-1 rounded transition ${
                  timeframe === t.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Language Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#161b22] border border-gray-700 rounded-md px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-blue-500"
          >
            {exploreData.languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trending Repos Table */}
      <div className="border border-gray-700 rounded-md bg-[#0d1117] divide-y divide-gray-800 mb-8">
        <div className="bg-[#161b22] px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-blue-400" />
            <span>Trending Repositories</span>
          </div>
          <span className="text-xs text-gray-400 font-normal">Updated in real time</span>
        </div>

        {filteredTrending.map((repo) => {
          const repoKey = `${repo.owner}/${repo.name}`;
          const isStarred = !!starredRepos[repoKey];

          return (
            <div key={repoKey} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-[#161b22]/40 transition">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Compass size={16} className="text-gray-500" />
                  <Link to="/react/react" className="text-blue-400 hover:underline text-lg font-semibold">
                    {repo.owner} / <span className="font-bold">{repo.name}</span>
                  </Link>
                </div>

                <p className="text-sm text-gray-300 mb-3 max-w-3xl">
                  {repo.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                    <span>{repo.language}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Star size={14} />
                    <span>{repo.stars}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <GitFork size={14} />
                    <span>{repo.forks}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span>Built by</span>
                    <div className="flex -space-x-1">
                      {repo.builtBy.map((c) => (
                        <img
                          key={c.login}
                          src={c.avatarUrl}
                          alt={c.login}
                          className="w-4 h-4 rounded-full border border-gray-900"
                        />
                      ))}
                    </div>
                  </div>

                  <span className="text-green-400 font-medium">+{repo.starsToday} stars today</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => toggleStar(repoKey)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center space-x-1.5 transition ${
                    isStarred
                      ? 'bg-yellow-950/40 border-yellow-700 text-yellow-300'
                      : 'bg-[#21262d] border-gray-700 text-gray-200 hover:bg-gray-700'
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

      {/* Featured Collections */}
      <h2 className="text-xl font-semibold text-white mb-4">Curated Collections</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {exploreData.collections.map((col) => (
          <div key={col.id} className="bg-[#161b22] border border-gray-700 rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs text-blue-400 mb-2 font-mono">
                <Layers size={14} />
                <span>{col.curator}</span>
              </div>
              <h3 className="font-semibold text-white text-base mb-2">{col.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{col.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
              <span>{col.itemCount} repositories</span>
              <button
                onClick={() => addToast(`Opened collection: ${col.title}`, 'info')}
                className="text-blue-400 hover:underline font-medium"
              >
                View collection →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioExplore() {
  const { addToast } = useAppStore();
  const [votedTopics, setVotedTopics] = useState<Record<string, boolean>>({});

  const toggleTopic = (topic: string) => {
    setVotedTopics(prev => {
      const next = !prev[topic];
      addToast(next ? `Subscribed to topic #${topic}` : `Unsubscribed from #${topic}`, 'info');
      return { ...prev, [topic]: next };
    });
  };

  const allTopics = Array.from(new Set(exploreData.trending.flatMap(t => t.topicTags)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Open Source Radar
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            Community Radar
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Tracking velocity spikes, architectural breakthroughs, and high-momentum contributors worldwide.
          </p>
        </div>

        <Link
          to="/react/react"
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Compass size={16} />
          <span>Explore Ecosystem</span>
        </Link>
      </div>

      {/* Spotlight Editorial Story */}
      <div className="bg-white border-2 border-ink p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="inline-block bg-highlight-yellow text-ink border border-ink text-xs font-black uppercase px-2 py-0.5 mb-2">
              Deep Dive Spotlight • {exploreData.spotlightStory.readTime}
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-ink uppercase tracking-tight mb-2">
              {exploreData.spotlightStory.headline}
            </h2>
            <p className="text-sm text-ink/80 font-medium mb-4">
              {exploreData.spotlightStory.subline}
            </p>
            <div className="text-xs font-bold text-ink/60">
              By {exploreData.spotlightStory.author} in {exploreData.spotlightStory.repo}
            </div>
          </div>

          <Link
            to="/react/react/pull/28271"
            className="px-5 py-3 bg-ink text-paper-warm font-display font-black uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center space-x-2 flex-shrink-0"
          >
            <span>Read Architecture Story</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Velocity Cards Grid */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-3">// High-Momentum Repositories</div>
        <div className="grid md:grid-cols-2 gap-6">
          {exploreData.trending.map((item) => (
            <div
              key={item.name}
              className="bg-white border-2 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between hover:-translate-y-0.5 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link to="/react/react" className="font-display font-black text-2xl text-ink hover:underline">
                    {item.owner}/{item.name}
                  </Link>
                  <span className="bg-ship-green text-white border border-ink text-xs font-black uppercase px-2 py-0.5">
                    {item.velocityText}
                  </span>
                </div>

                <p className="text-xs text-ink/80 font-medium mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.topicTags.map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase bg-paper-warm border border-ink px-2 py-0.5">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-ink/10 text-xs font-bold">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Star size={14} className="fill-highlight-yellow text-ink" />
                    <span>{item.stars}</span>
                  </span>
                  <span>{item.language}</span>
                </div>

                <div className="flex items-center -space-x-1.5">
                  {item.builtBy.map(c => (
                    <img key={c.login} src={c.avatarUrl} alt={c.login} className="w-6 h-6 rounded-full border-2 border-ink" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Cloud */}
      <div className="bg-white border-2 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
        <h3 className="font-display font-black text-lg uppercase tracking-tight text-ink mb-3">
          Emerging Domain Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTopics.map(t => (
            <button
              key={t}
              onClick={() => toggleTopic(t)}
              className={`px-3 py-1 font-bold uppercase text-xs border-2 border-ink transition ${
                votedTopics[t]
                  ? 'bg-ship-green text-white'
                  : 'bg-paper-warm text-ink hover:bg-highlight-yellow'
              }`}
            >
              #{t} {votedTopics[t] ? '✓' : '+'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicExplore /> : <StudioExplore />;
}
