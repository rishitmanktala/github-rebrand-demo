import React from 'react';
import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { FileCode2, Folder, CheckCircle, GitPullRequest, MessageSquare, Play, Sparkles, Star, Eye } from 'lucide-react';
import repoData from '../data/repo.react.json';

function ClassicRepo() {
  const { starredRepos, toggleStarRepo, addToast } = useAppStore();
  const repoKey = `${repoData.owner}/${repoData.name}`;
  const isStarred = Boolean(starredRepos[repoKey] || starredRepos['facebook/react']);

  const baseStarsNum = parseInt(repoData.stars.replace(/,/g, ''), 10) || 220000;
  const displayStars = isStarred ? (baseStarsNum + 1).toLocaleString() : repoData.stars;

  const handleToggleStar = () => {
    const willStar = !isStarred;
    toggleStarRepo(repoKey);
    addToast(willStar ? `Starred ${repoData.name}!` : `Unstarred ${repoData.name}`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-classic flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div data-tour="repo-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2 text-xl">
            <span className="text-blue-400 font-semibold">{repoData.owner}</span>
            <span className="text-gray-400">/</span>
            <span className="text-blue-400 font-bold">{repoData.name}</span>
            <span className="border border-gray-700 rounded-full px-2 py-0.5 text-xs text-gray-400 ml-2">Public</span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => addToast('Watching all notifications for this repository', 'info')}
              className="flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold border border-gray-700 bg-[#21262d] text-gray-300 hover:bg-[#30363d] transition"
            >
              <Eye size={13} />
              <span>Watch</span>
            </button>
            <button 
              onClick={() => addToast(`Fork created in demo-user/${repoData.name}!`, 'success')}
              className="flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold border border-gray-700 bg-[#21262d] text-gray-300 hover:bg-[#30363d] transition"
            >
              <GitPullRequest size={13} />
              <span>Fork</span>
              <span className="bg-[#161b22] px-1.5 py-0.2 rounded-full border border-gray-700 text-gray-400 ml-1">
                {repoData.forks}
              </span>
            </button>
            <button 
              onClick={handleToggleStar}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold border transition ${
                isStarred 
                  ? 'bg-[#21262d] border-gray-600 text-yellow-400' 
                  : 'bg-[#21262d] border-gray-700 text-gray-300 hover:bg-[#30363d]'
              }`}
            >
              <Star size={13} className={isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
              <span>{isStarred ? 'Starred' : 'Star'}</span>
              <span className="bg-[#161b22] px-1.5 py-0.2 rounded-full border border-gray-700 text-gray-400 ml-1">
                {displayStars}
              </span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm border-b border-gray-800 pb-2">
          <div className="border-b-2 border-orange-400 pb-2 font-semibold text-white">Code</div>
          <Link to="/issues" className="pb-2 text-gray-400 hover:text-gray-200">Issues <span className="bg-gray-800 px-1.5 rounded-full text-xs">1.2k</span></Link>
          <Link to={`/${repoData.owner}/${repoData.name}/pull/28271`} className="pb-2 text-gray-400 hover:text-white">Pull requests <span className="bg-gray-800 px-1.5 rounded-full text-xs">245</span></Link>
          <Link to="/workspace" className="pb-2 text-gray-400 hover:text-gray-200">Actions</Link>
        </div>

        <div className="border border-gray-700 rounded-md">
          <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 flex items-center justify-between text-sm rounded-t-md">
            <div className="flex items-center space-x-2">
              <img src="/brand/logo.png" className="w-5 h-5 rounded-full" alt="bot" />
              <span className="font-semibold text-white">facebook-bot</span>
              <span className="text-gray-400">Merge pull request #28271</span>
            </div>
            <div className="text-gray-400">2 hours ago</div>
          </div>
          <div className="divide-y divide-gray-800">
            {repoData.files.map((file, i) => (
              <Link to={`/${repoData.owner}/${repoData.name}/blob/${file.name}`} key={i} className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-800/50 cursor-pointer block">
                <div className="flex items-center space-x-3 w-1/3">
                  {file.name.includes('.') ? <FileCode2 size={16} className="text-gray-500" /> : <Folder size={16} className="text-blue-300" />}
                  <span className="text-white hover:text-blue-400 transition">{file.name}</span>
                </div>
                <div className="text-gray-500 truncate w-1/2">{file.message}</div>
                <div className="text-gray-500 w-24 text-right">3 days ago</div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-8 border border-gray-700 rounded-md p-6">
          <h2 className="text-xl border-b border-gray-800 pb-2 mb-4 font-semibold text-white">README.md</h2>
          <div className="prose prose-invert">
            <h1 className="text-2xl font-bold text-white mb-2">React</h1>
            <p className="text-gray-300 mb-4">React is a JavaScript library for building user interfaces.</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li><strong>Declarative:</strong> React makes it painless to create interactive UIs.</li>
              <li><strong>Component-Based:</strong> Build encapsulated components that manage their own state.</li>
              <li><strong>Learn Once, Write Anywhere:</strong> We don't make assumptions about the rest of your technology stack.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="w-80 hidden md:block text-sm text-gray-400 space-y-6">
        <div>
          <h3 className="font-semibold text-white mb-2">About</h3>
          <p>{repoData.about}</p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">Stars</h3>
          <div>⭐ {displayStars}</div>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">Forks</h3>
          <div>🔱 {repoData.forks}</div>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">Releases</h3>
          <div>v18.3.1 (Latest)</div>
        </div>
      </div>
    </div>
  );
}

function StudioRepo() {
  const [showAi, setShowAi] = React.useState(false);
  const { starredRepos, toggleStarRepo, addToast } = useAppStore();
  const repoKey = `${repoData.owner}/${repoData.name}`;
  const isStarred = Boolean(starredRepos[repoKey] || starredRepos['facebook/react']);

  const baseStarsNum = parseInt(repoData.stars.replace(/,/g, ''), 10) || 220000;
  const displayStars = isStarred ? (baseStarsNum + 1).toLocaleString() : repoData.stars;

  const handleToggleStar = () => {
    const willStar = !isStarred;
    toggleStarRepo(repoKey);
    addToast(willStar ? `Starred ${repoData.name}!` : `Unstarred ${repoData.name}`, 'success');
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people studio-texture">
      <div data-tour="repo-header" className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tighter uppercase leading-none mb-2 text-ink">
            {repoData.name}
          </h1>
          <p className="text-xl text-gray-600 font-light">{repoData.about}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleToggleStar}
            className={`border-2 border-ink px-4 py-2 font-bold uppercase tracking-wide text-sm flex items-center space-x-2 shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none transition ${
              isStarred ? 'bg-highlight-yellow text-ink' : 'bg-white text-ink hover:bg-gray-50'
            }`}
          >
            <Star size={16} className={isStarred ? 'fill-ink text-ink' : ''} />
            <span>{isStarred ? 'Starred' : 'Star'} ({displayStars})</span>
          </button>
          <Link to={`/${repoData.owner}/${repoData.name}/suggest`} className="bg-ink text-paper-warm px-4 py-2 font-bold uppercase tracking-wide text-sm flex items-center space-x-2 hover:bg-gray-800 transition shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
            <Sparkles size={16} /> <span>Suggest a change</span>
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-2">// Momentum this week</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-ink p-4">
            <div className="text-4xl font-display font-black text-ship-green">34</div>
            <div className="text-sm font-bold uppercase tracking-tight mt-1">PRs Merged</div>
          </div>
          <div className="bg-white border-2 border-ink p-4">
            <div className="text-4xl font-display font-black text-ink">12</div>
            <div className="text-sm font-bold uppercase tracking-tight mt-1">Open Discussions</div>
          </div>
          <div className="bg-white border-2 border-ink p-4">
            <div className="text-4xl font-display font-black text-review-amber">v18.3</div>
            <div className="text-sm font-bold uppercase tracking-tight mt-1">Latest Release</div>
          </div>
          <div className="bg-white border-2 border-ink p-4 flex flex-col justify-center items-center">
            <CheckCircle size={32} className="text-ship-green mb-1" />
            <div className="text-sm font-bold uppercase tracking-tight">CI Health 100%</div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-2">// Workflow Fabric</div>
        <div className="flex items-center justify-between bg-white border-2 border-ink p-6 relative overflow-x-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-ink -z-0 -translate-y-1/2 mx-12"></div>
          
          {[
            { icon: MessageSquare, label: "Discussions", color: "text-ink", link: "/discussions" },
            { icon: FileCode2, label: "Codespaces", color: "text-ai-blue", link: "/codespaces" },
            { icon: GitPullRequest, label: "Review (PR)", color: "text-review-amber", link: `/${repoData.owner}/${repoData.name}/pull/28271` },
            { icon: Play, label: "Actions", color: "text-ink", link: "/workspace" },
            { icon: CheckCircle, label: "Ship", color: "text-ship-green", link: "/launch" },
          ].map((node, i) => (
            <Link to={node.link} key={i} className="z-10 flex flex-col items-center bg-white px-2 cursor-pointer group">
              <div className={`w-12 h-12 border-2 border-ink bg-white flex items-center justify-center rounded-sm mb-2 group-hover:-translate-y-1 transition ${node.color}`}>
                <node.icon size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-tighter">{node.label}</span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-ink/60 mt-2 text-center">Unified pipeline: ideas to shipped code.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-display font-black uppercase tracking-tight">Code</h3>
            <button 
              onClick={() => setShowAi(!showAi)}
              className="text-sm font-bold text-ai-blue flex items-center space-x-1 border border-ai-blue/30 px-3 py-1 bg-ai-blue/5 hover:bg-ai-blue/10 transition"
            >
              <Sparkles size={14} />
              <span>Explain this repo in plain English</span>
            </button>
          </div>
          
          {showAi && (
            <div className="bg-blue-50 border-2 border-ai-blue p-4 mb-4 text-sm text-blue-900">
              <strong className="block mb-1 font-bold font-display uppercase">Copilot Summary</strong>
              React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manages how data updates are rendered on the screen efficiently using a virtual DOM.
            </div>
          )}

          <div className="border-2 border-ink bg-white">
            <div className="divide-y-2 divide-ink">
              {repoData.files.map((file, i) => (
                <Link to={`/${repoData.owner}/${repoData.name}/blob/${file.name}`} key={i} className="flex justify-between items-center px-4 py-3 hover:bg-highlight-yellow/20 transition cursor-pointer block">
                  <div className="flex items-center space-x-3 w-1/3 font-code text-sm font-bold">
                    {file.name.includes('.') ? <FileCode2 size={16} className="text-ink" /> : <Folder size={16} className="text-ink" />}
                    <span>{file.name}</span>
                  </div>
                  <div className="text-gray-600 truncate w-1/2 text-sm">{file.message}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
           <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4">Active Builders</h3>
           <div className="space-y-4">
             {['gnoff', 'sebmarkbage', 'acdlite', 'gaearon'].map((user) => (
               <Link 
                 to={`/${user}`} 
                 key={user} 
                 className="flex items-center space-x-3 p-3 border-2 border-ink bg-white hover:bg-highlight-yellow/10 transition cursor-pointer block"
               >
                 <div className="w-10 h-10 bg-gray-200 border border-ink overflow-hidden">
                   <img src={`https://github.com/${user}.png?size=80`} className="w-full h-full object-cover" alt={user} />
                 </div>
                 <div>
                   <div className="font-bold">{user}</div>
                   <div className="text-xs text-gray-500">Shipping Client APIs</div>
                 </div>
               </Link>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

export default function RepoPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicRepo /> : <StudioRepo />;
}
