import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Users, Star, Share2, BookMarked, FolderGit2, Package, Search, X, Check, Copy } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import profileData from '../data/profile.shadcn.json';

// Generate deterministic 52-week contribution data ending today
export interface ContributionDay {
  dayIndex: number;
  col: number;
  row: number;
  level: 0 | 1 | 2 | 3 | 4;
  contribs: number;
  dateStr: string;
}

const WEEKS_COUNT = 52;
const END_DATE = new Date(2026, 9, 1); // Oct 1, 2026

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const staticContributionColumns: ContributionDay[][] = Array.from({ length: WEEKS_COUNT }).map((_, col) => {
  return Array.from({ length: 7 }).map((_, row) => {
    const dayOffset = (51 - col) * 7 + (6 - row);
    const dayDate = new Date(END_DATE.getTime() - dayOffset * 86400000);
    const dateStr = dayDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const isWeekend = row === 0 || row === 6;
    const seed = col * 7 + row + 42;
    const rand = seededRandom(seed);

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    let contribs = 0;

    if (isWeekend) {
      if (rand > 0.6) {
        level = (Math.floor(rand * 3) + 1) as 1 | 2 | 3;
        contribs = level * 3 + Math.floor(rand * 4);
      }
    } else {
      if (rand > 0.15) {
        level = (Math.floor(rand * 4) + 1) as 1 | 2 | 3 | 4;
        contribs = level * 3 + Math.floor(rand * 5);
      }
    }

    return {
      dayIndex: col * 7 + row,
      col,
      row,
      level,
      contribs,
      dateStr
    };
  });
});

// Month label positions (which column index begins each month)
const monthLabels: { col: number; name: string }[] = [];
let prevMonth = -1;
for (let col = 0; col < WEEKS_COUNT; col++) {
  const dayOffset = (51 - col) * 7 + 6;
  const d = new Date(END_DATE.getTime() - dayOffset * 86400000);
  const m = d.getMonth();
  if (m !== prevMonth) {
    monthLabels.push({
      col,
      name: d.toLocaleDateString('en-US', { month: 'short' })
    });
    prevMonth = m;
  }
}

const CLASSIC_COLORS = [
  'bg-contrib-0',
  'bg-contrib-1',
  'bg-contrib-2',
  'bg-contrib-3',
  'bg-contrib-4'
];

const STUDIO_COLORS = [
  'bg-[#EBEDF0]',
  'bg-[#9BE9A8]',
  'bg-[#40C463]',
  'bg-[#30A14E]',
  'bg-[#216E39]'
];

function ContributionDetailModal({ dayDetail, onClose, isClassic }: { dayDetail: ContributionDay | null; onClose: () => void; isClassic: boolean }) {
  if (!dayDetail) return null;

  const hasContribs = dayDetail.contribs > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        className={`max-w-md w-full p-6 relative ${
          isClassic 
            ? 'bg-[#161b22] text-[#f0f6fc] border border-gray-700 rounded-lg shadow-xl font-classic' 
            : 'bg-paper-warm text-ink border-4 border-ink shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] font-people'
        }`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded ${isClassic ? 'text-gray-400 hover:text-white' : 'text-ink hover:bg-gray-200'}`}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className={`text-lg font-bold mb-1 ${isClassic ? 'font-classic' : 'font-display uppercase tracking-tight'}`}>
          Activity on {dayDetail.dateStr}
        </h3>
        <p className={`text-xs mb-4 ${isClassic ? 'text-gray-400' : 'text-gray-600 font-semibold'}`}>
          {dayDetail.contribs === 0 ? 'No' : dayDetail.contribs} contributions recorded
        </p>

        {hasContribs ? (
          <div className={`p-3 rounded border divide-y ${isClassic ? 'bg-[#0d1117] border-gray-800 divide-gray-800 text-xs' : 'bg-white border-2 border-ink divide-y-2 divide-ink text-xs font-medium'}`}>
            <div className="py-2 first:pt-0">
              <span className="font-bold text-ship-green block">Merged Pull Request</span>
              <span className="opacity-90">facebook/react#28271: Move client React DOM APIs</span>
            </div>
            <div className="py-2">
              <span className="font-bold text-merge-purple block">Commits</span>
              <span className="opacity-90">{Math.max(1, Math.round(dayDetail.contribs * 0.6))} commits pushed to shadcn/ui:main</span>
            </div>
            <div className="py-2 last:pb-0">
              <span className="font-bold text-ai-blue block">Code Review</span>
              <span className="opacity-90">{Math.max(1, Math.round(dayDetail.contribs * 0.4))} discussions and RFC reviews</span>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded border text-center ${isClassic ? 'bg-[#0d1117] border-gray-800 text-gray-400 text-xs' : 'bg-white border-2 border-ink text-ink/70 text-xs'}`}>
            No contributions recorded on this day.
          </div>
        )}
      </div>
    </div>
  );
}

function ContributionCalendar({
  isClassic,
  onSelectDay
}: {
  isClassic: boolean;
  onSelectDay: (day: ContributionDay) => void;
}) {
  const colors = isClassic ? CLASSIC_COLORS : STUDIO_COLORS;
  const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-fit">
        {/* Month labels row */}
        <div className="relative h-4 mb-1.5 ml-6 text-[10px] select-none">
          {monthLabels.map((m) => (
            <span
              key={`${m.name}-${m.col}`}
              className={`absolute top-0 font-medium ${
                isClassic ? 'text-gray-400' : 'text-ink/70 font-semibold'
              }`}
              style={{ left: `${m.col * 12}px` }}
            >
              {m.name}
            </span>
          ))}
        </div>

        {/* Days labels and grid */}
        <div className="flex">
          {/* Day of week labels */}
          <div className="flex flex-col gap-[2px] pr-1.5 w-6 text-right select-none justify-between">
            {dayNames.map((d, i) => (
              <span
                key={i}
                className={`h-[10px] text-[9px] leading-[10px] block font-medium ${
                  isClassic ? 'text-gray-500' : 'text-ink/60'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* 52 columns */}
          <div className="flex gap-[2px]">
            {staticContributionColumns.map((colData, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[2px]">
                {colData.map((day) => (
                  <button
                    key={day.dayIndex}
                    type="button"
                    onClick={() => onSelectDay(day)}
                    className={`w-[10px] h-[10px] rounded-[2px] ${colors[day.level]} ${
                      isClassic
                        ? 'border border-transparent hover:border-gray-300'
                        : 'border border-ink/15 hover:border-ink hover:scale-125 hover:z-10 shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
                    } transition-all cursor-pointer`}
                    title={`${day.contribs === 0 ? 'No' : day.contribs} contributions on ${day.dateStr} (Click for details)`}
                    aria-label={`${day.contribs} contributions on ${day.dateStr}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end space-x-1.5 mt-3 pt-2 text-[11px] select-none">
          <span className={isClassic ? 'text-gray-400 text-xs' : 'text-ink/60 font-medium'}>Less</span>
          {colors.map((c, i) => (
            <div
              key={i}
              className={`w-[10px] h-[10px] rounded-[2px] ${c} ${
                isClassic ? 'border border-gray-700' : 'border border-ink/20'
              }`}
            />
          ))}
          <span className={isClassic ? 'text-gray-400 text-xs' : 'text-ink/60 font-medium'}>More</span>
        </div>
      </div>
    </div>
  );
}

function ClassicProfile() {
  const { addToast, starredRepos, toggleStarRepo } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const [repoSearch, setRepoSearch] = useState('');
  
  const currentTab = searchParams.get('tab') || 'overview';

  const formatStars = (repoName: string, baseStarsStr: string) => {
    const isStarred = Boolean(starredRepos[repoName]);
    const cleanNum = parseInt(baseStarsStr.replace(/,/g, ''), 10) || 52000;
    return isStarred ? (cleanNum + 1).toLocaleString() : baseStarsStr;
  };

  const handleToggleStar = (repoName: string) => {
    const willStar = !starredRepos[repoName];
    toggleStarRepo(repoName);
    addToast(willStar ? `Starred ${repoName}!` : `Unstarred ${repoName}`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic flex flex-col md:flex-row gap-8">
      <ContributionDetailModal dayDetail={selectedDay} onClose={() => setSelectedDay(null)} isClassic={true} />

      <div className="w-full md:w-1/4">
        <img src="https://github.com/shadcn.png" className="w-full rounded-full border border-gray-700 mb-4" alt="Avatar" />
        <h1 className="text-2xl font-bold text-white leading-tight">{profileData.name}</h1>
        <h2 className="text-xl text-gray-400 font-light mb-4">{profileData.login}</h2>
        <p className="mb-4 text-white">{profileData.bio}</p>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Users size={16} />
          <span className="font-semibold text-white">{profileData.followers}</span> followers
          <span>·</span>
          <span className="font-semibold text-white">{profileData.following}</span> following
        </div>
      </div>
      
      <div className="w-full md:w-3/4">
        <div className="border-b border-gray-800 pb-2 mb-6 flex space-x-4 text-sm font-semibold">
          <button 
            onClick={() => setSearchParams({})} 
            className={`pb-2 border-b-2 transition ${currentTab === 'overview' ? 'text-white border-orange-400' : 'text-gray-400 hover:text-gray-200 border-transparent'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setSearchParams({ tab: 'repositories' })} 
            className={`pb-2 border-b-2 transition flex items-center space-x-1.5 ${currentTab === 'repositories' ? 'text-white border-orange-400' : 'text-gray-400 hover:text-gray-200 border-transparent'}`}
          >
            <BookMarked size={14} />
            <span>Repositories</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.2 rounded-full">6</span>
          </button>
          <button 
            onClick={() => setSearchParams({ tab: 'projects' })} 
            className={`pb-2 border-b-2 transition flex items-center space-x-1.5 ${currentTab === 'projects' ? 'text-white border-orange-400' : 'text-gray-400 hover:text-gray-200 border-transparent'}`}
          >
            <FolderGit2 size={14} />
            <span>Projects</span>
          </button>
          <button 
            onClick={() => setSearchParams({ tab: 'packages' })} 
            className={`pb-2 border-b-2 transition flex items-center space-x-1.5 ${currentTab === 'packages' ? 'text-white border-orange-400' : 'text-gray-400 hover:text-gray-200 border-transparent'}`}
          >
            <Package size={14} />
            <span>Packages</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {currentTab === 'overview' && (
          <div>
            <div className="mb-8">
              <p className="text-gray-400 mb-2 text-xs font-semibold">Pinned</p>
              <div className="grid md:grid-cols-2 gap-4">
                {profileData.pinnedRepos.map((repo, idx) => {
                  const isStarred = Boolean(starredRepos[repo.repoName]);
                  return (
                    <div key={idx} className="border border-gray-700 rounded-md p-4 flex flex-col bg-[#0d1117]">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/${profileData.login}/${repo.repoName}`} className="text-blue-400 font-semibold hover:underline">{repo.repoName}</Link>
                        <span className="border border-gray-700 rounded-full px-2 py-0.5 text-xs text-gray-400">Public</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 flex-1">{repo.desc}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {repo.lang && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                            <span>{repo.lang}</span>
                          </div>
                        )}
                        <div 
                          className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer" 
                          onClick={() => handleToggleStar(repo.repoName)}
                          title={isStarred ? "Unstar repository" : "Star repository"}
                        >
                          <Star size={14} className={isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />
                          <span className={isStarred ? "text-yellow-400 font-bold" : "text-gray-400"}>{formatStars(repo.repoName, repo.stars)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div data-tour="profile-graph">
               <h3 className="text-gray-400 text-sm mb-2 font-semibold">4,815 contributions in the last year</h3>
               <div className="border border-gray-700 rounded-md p-4 bg-[#161b22]">
                 <ContributionCalendar isClassic={true} onSelectDay={setSelectedDay} />
               </div>
            </div>
          </div>
        )}

        {/* Tab 2: Repositories */}
        {currentTab === 'repositories' && (
          <div className="space-y-4">
            <div className="flex space-x-3 pb-3 border-b border-gray-800">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Find a repository..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-gray-700 rounded text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-800">
              {profileData.pinnedRepos
                .filter(r => r.repoName.toLowerCase().includes(repoSearch.toLowerCase()) || r.desc.toLowerCase().includes(repoSearch.toLowerCase()))
                .map((repo, idx) => {
                  const isStarred = Boolean(starredRepos[repo.repoName]);
                  return (
                    <div key={idx} className="py-4 flex justify-between items-start">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <Link to={`/${profileData.login}/${repo.repoName}`} className="text-blue-400 font-bold text-lg hover:underline">
                            {repo.repoName}
                          </Link>
                          <span className="border border-gray-700 rounded-full px-2 py-0.2 text-xs text-gray-400">Public</span>
                        </div>
                        <p className="text-gray-400 text-sm">{repo.desc}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 pt-2">
                          <span className="flex items-center space-x-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                            <span>{repo.lang || 'TypeScript'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star size={12} className={isStarred ? "text-yellow-400 fill-yellow-400" : ""} />
                            <span>{formatStars(repo.repoName, repo.stars)}</span>
                          </span>
                          <span>Updated 2 days ago</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStar(repo.repoName)}
                        className={`px-3 py-1 border rounded text-xs font-semibold flex items-center space-x-1 transition ${
                          isStarred 
                            ? 'bg-[#21262d] border-gray-600 text-yellow-400' 
                            : 'bg-[#21262d] border-gray-700 text-gray-300 hover:bg-[#30363d]'
                        }`}
                      >
                        <Star size={13} className={isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
                        <span>{isStarred ? 'Starred' : 'Star'}</span>
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {currentTab === 'projects' && (
          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-6 bg-[#0d1117] space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h4 className="text-white font-bold text-base">shadcn/ui v1.0 Architecture & Components</h4>
                <span className="bg-green-900/40 text-green-400 border border-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
              <p className="text-gray-400 text-sm">
                Public design system roadmap covering Radix primitives, Tailwind CSS plugins, dark mode tokens, and accessible animations.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-[#161b22] border border-gray-800 p-3 rounded">
                  <div className="text-gray-400 font-semibold mb-1">To Do</div>
                  <div className="text-white font-bold">14 items</div>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-3 rounded">
                  <div className="text-yellow-400 font-semibold mb-1">In Progress</div>
                  <div className="text-white font-bold">6 items</div>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-3 rounded">
                  <div className="text-green-400 font-semibold mb-1">Done</div>
                  <div className="text-white font-bold">52 items</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Packages */}
        {currentTab === 'packages' && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: '@shadcn/ui', desc: 'Beautifully designed components copy-pasted into your apps', version: 'v0.9.4', dl: '2.4M downloads' },
              { name: '@shadcn/typography', desc: 'Prose styles and responsive font scales for Tailwind', version: 'v0.2.1', dl: '450k downloads' },
              { name: '@shadcn/taxonomy', desc: 'Category and tag management engine for Next.js content', version: 'v1.0.0', dl: '120k downloads' },
            ].map((pkg, i) => (
              <div key={i} className="border border-gray-700 rounded-lg p-5 bg-[#0d1117] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 font-bold text-blue-400 text-base mb-1">
                    <Package size={16} />
                    <span>{pkg.name}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">{pkg.desc}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-800">
                  <span>{pkg.version}</span>
                  <span className="text-gray-400 font-medium">{pkg.dl}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function StudioProfile() {
  const [showShare, setShowShare] = React.useState(false);
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const { addToast, starredRepos, toggleStarRepo } = useAppStore();

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(`[![GitHub Build](https://github.com/${profileData.login}.png)](https://github.com/${profileData.login})`);
    addToast('Markdown badge copied to clipboard!', 'success');
    setShowShare(false);
  };

  const handleDownload = () => {
    addToast('Generating high-res PNG...', 'info');
    setTimeout(() => {
      addToast('Download complete.', 'success');
      setShowShare(false);
    }, 1500);
  };

  const handleToggleStar = (repoName: string) => {
    const willStar = !starredRepos[repoName];
    toggleStarRepo(repoName);
    addToast(willStar ? `Starred ${repoName}!` : `Unstarred ${repoName}`, 'success');
  };

  const formatStars = (repoName: string, baseStarsStr: string) => {
    const isStarred = Boolean(starredRepos[repoName]);
    const cleanNum = parseInt(baseStarsStr.replace(/,/g, ''), 10) || 52000;
    return isStarred ? (cleanNum + 1).toLocaleString() : baseStarsStr;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-people studio-texture">
      <ContributionDetailModal dayDetail={selectedDay} onClose={() => setSelectedDay(null)} isClassic={false} />

      {showShare && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer" onClick={() => setShowShare(false)}>
           <div className="bg-paper-warm p-8 border-2 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] max-w-xl w-full relative cursor-default" onClick={e => e.stopPropagation()}>
             <button
               onClick={() => setShowShare(false)}
               className="absolute top-4 right-4 p-1.5 rounded transition text-ink hover:bg-gray-200 border-2 border-transparent hover:border-ink"
               aria-label="Close share modal"
             >
               <X size={20} />
             </button>
             <h3 className="text-xl font-display font-black uppercase mb-4 text-ink">Share my build</h3>
             <div className="bg-canvas text-paper p-8 mb-6 border-2 border-ink relative overflow-hidden flex items-center shadow-lg">
                <div className="absolute -right-10 -bottom-10 opacity-20">
                  <img src="/brand/logo.png" className="w-64 h-64" style={{ filter: 'grayscale(100%) brightness(200)' }} alt="Logo background" />
                </div>
                <img src="https://github.com/shadcn.png" className="w-24 h-24 rounded-full border-4 border-ship-green mr-6 z-10" alt="Avatar" />
                <div className="z-10">
                  <div className="text-3xl font-display font-black uppercase">{profileData.login}</div>
                  <div className="text-ship-green font-bold">4,815 Contributions · 122 Day Streak</div>
                  <div className="text-gray-400 mt-2 text-sm">Where We Build Together.</div>
                </div>
             </div>
             <div className="flex space-x-4">
               <button onClick={handleCopyBadge} className="flex-1 bg-ink text-white font-bold uppercase text-sm py-3 border-2 border-ink shadow-[2px_2px_0px_0px_rgba(46,160,67,1)] hover:translate-y-px hover:shadow-none transition flex items-center justify-center space-x-1.5">
                 <Copy size={16} />
                 <span>Copy Markdown Badge</span>
               </button>
               <button onClick={handleDownload} className="flex-1 bg-ship-green text-white font-bold uppercase text-sm py-3 border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none transition">
                 Download PNG
               </button>
             </div>
           </div>
         </div>
      )}

      <div className="flex flex-col items-center mb-16 text-center">
        <img src="https://github.com/shadcn.png" className="w-32 h-32 rounded-full border-4 border-ink mb-6" alt="Avatar" />
        <h1 className="text-6xl font-display font-black uppercase tracking-tighter text-ink mb-2">{profileData.name}</h1>
        <h2 className="text-2xl text-gray-600 font-light mb-6">{profileData.bio}</h2>
        
        <div className="flex items-center space-x-6 text-sm font-bold uppercase tracking-wide">
          <div className="flex items-center space-x-1">
            <Users size={16} /> <span>{profileData.followers} Followers</span>
          </div>
          <button 
            onClick={() => setShowShare(true)}
            className="flex items-center space-x-1 text-ai-blue hover:text-blue-700 transition"
          >
            <Share2 size={16} /> <span>Share my build</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div data-tour="profile-graph">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Work history — every green square is a day with activity</div>
            <div className="text-[10px] text-gray-400 mb-4">Darker = more work done that day. Click any square to see what happened.</div>
            <div className="bg-white border-2 border-ink p-6 shadow-sm">
               <ContributionCalendar isClassic={false} onSelectDay={setSelectedDay} />
               <div className="mt-4 flex flex-wrap justify-between items-center text-sm font-bold uppercase tracking-tighter border-t-2 border-ink pt-4">
                 <div>122 Day Streak 🔥</div>
                 <div className="text-ship-green">4,815 total contributions</div>
                 <div>Best: 180 days</div>
               </div>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Pinned projects — click to explore</div>
            <div className="grid grid-cols-2 gap-4">
              {profileData.pinnedRepos.map((repo, idx) => {
                const isStarred = Boolean(starredRepos[repo.repoName]);
                return (
                  <div key={idx} className="bg-white border-2 border-ink p-5 flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <Link to={`/${profileData.login}/${repo.repoName}`} className="font-display font-black text-xl uppercase tracking-tight hover:text-ai-blue">
                        {repo.repoName}
                      </Link>
                      <div className="flex space-x-1">
                        <div className="w-2 h-6 bg-ship-green rounded-full"></div>
                        <div className="w-2 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-5 bg-ship-green rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 flex-1">{repo.desc}</p>
                    <div className="flex justify-between items-center font-bold text-xs uppercase tracking-tight">
                      <span className={repo.lang ? 'text-ink' : 'text-gray-400'}>{repo.lang || 'N/A'}</span>
                      <button 
                        type="button"
                        onClick={() => handleToggleStar(repo.repoName)} 
                        className={`flex items-center space-x-1 px-2 py-1 border border-ink transition ${isStarred ? 'bg-highlight-yellow text-ink' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <Star size={14} className={isStarred ? 'fill-ink text-ink' : 'text-gray-600'} /> 
                        <span>{formatStars(repo.repoName, repo.stars)}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-highlight-yellow border-2 border-ink p-6 mb-8 shadow-sm">
            <h3 className="font-display font-black text-xl uppercase mb-1">Shipped this week</h3>
            <p className="text-sm font-bold text-gray-700 mb-4 tracking-tighter">A snapshot of recent activity.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-ink pb-2">
                <div>
                  <span className="font-bold block">Changes approved</span>
                  <span className="text-[10px] text-gray-600">suggestions merged in</span>
                </div>
                <span className="text-2xl font-black">12</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-ink pb-2">
                <div>
                  <span className="font-bold block">Saves (commits)</span>
                  <span className="text-[10px] text-gray-600">individual code saves</span>
                </div>
                <span className="text-2xl font-black">45</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-ink pb-2">
                <span className="font-bold">Reviews given</span>
                <span className="text-2xl font-black">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicProfile /> : <StudioProfile />;
}
