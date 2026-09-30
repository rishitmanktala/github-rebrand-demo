import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Users, GitPullRequest, GitMerge, Activity, Radio, 
  Sparkles, CheckCircle, Shield, ArrowUpRight, Plus, 
  Play, MessageSquare 
} from 'lucide-react';
import workspaceData from '../data/workspace.json';

function ClassicWorkspace() {
  const { addToast } = useAppStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{workspaceData.workspaceName}</h1>
          <p className="text-gray-400 text-sm mt-1">{workspaceData.tagline}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => addToast('Created new workspace view', 'success')}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Multi-repo Dashboard & Pending Reviews */}
        <div className="md:col-span-2 space-y-6">
          {/* Multi-Repo Pinned Projects */}
          <div className="border border-gray-700 rounded-md bg-[#0d1117] overflow-hidden">
            <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 flex items-center justify-between text-sm font-semibold text-gray-200">
              <span>Managed Repositories</span>
              <span className="text-xs text-gray-400 font-normal">{workspaceData.pinnedProjects.length} connected</span>
            </div>

            <div className="divide-y divide-gray-800">
              {workspaceData.pinnedProjects.map((proj) => (
                <div key={proj.name} className="p-4 hover:bg-[#161b22]/40 transition flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link to="/react/react" className="text-blue-400 hover:underline font-semibold text-base">
                        {proj.name}
                      </Link>
                      <span className="text-xs bg-green-950 border border-green-800 text-green-300 px-2 py-0.5 rounded">
                        {proj.health}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{proj.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                      <span className="font-mono text-gray-500">branch: {proj.branch}</span>
                      <span>•</span>
                      <span>{proj.openPrs} open PRs</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs bg-amber-950 border border-amber-800 text-amber-300 px-2 py-1 rounded font-medium">
                      {proj.pendingReviews} reviews pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="border border-gray-700 rounded-md bg-[#0d1117] overflow-hidden">
            <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 flex items-center justify-between text-sm font-semibold text-gray-200">
              <div className="flex items-center space-x-2">
                <Activity size={16} className="text-blue-400" />
                <span>Workspace Activity Stream</span>
              </div>
              <span className="text-xs text-gray-400 font-normal">Real-time team log</span>
            </div>

            <div className="divide-y divide-gray-800">
              {workspaceData.activityFeed.map((act) => (
                <div key={act.id} className="p-4 flex items-start space-x-3 text-sm hover:bg-[#161b22]/40 transition">
                  <img src={act.actor.avatarUrl} alt={act.actor.login} className="w-6 h-6 rounded-full border border-gray-700 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{act.actor.login}</span>
                      <span className="text-gray-400">{act.message}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span className="text-blue-400">{act.target}</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Team Directory */}
        <div>
          <div className="border border-gray-700 rounded-md bg-[#0d1117] overflow-hidden">
            <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 text-sm font-semibold text-gray-200">
              Team Presence
            </div>
            <div className="divide-y divide-gray-800 p-2">
              {workspaceData.teamMembers.map((member) => (
                <div key={member.login} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full border border-gray-700" />
                      <div className={`w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 border-2 border-[#0d1117] ${
                        member.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{member.name}</div>
                      <div className="text-xs text-gray-400">{member.role}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    member.isOnline ? 'text-green-400 bg-green-950/40' : 'text-gray-500 bg-gray-900'
                  }`}>
                    {member.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioWorkspace() {
  const { addToast } = useAppStore();
  const [joinedSessions, setJoinedSessions] = useState<Record<string, boolean>>({});

  const toggleSession = (id: string, title: string) => {
    setJoinedSessions(prev => {
      const next = !prev[id];
      addToast(next ? `Joined live pairing session: ${title}` : `Left pairing session`, 'success');
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Team Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            The Shared Workshop
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            See what your whole team is working on right now — live sessions, projects in progress, and who's online.
          </p>
        </div>

        <button
          onClick={() => addToast('Started a new live session — invite your team!', 'info')}
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Sparkles size={16} />
          <span>Start Live Session</span>
        </button>
      </div>

      {/* Active Pairing Session Cards */}
      <div className="mb-10">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-ink/60 mb-3">
          <Radio size={16} className="text-diff-red animate-pulse" />
          <span>Live right now — {workspaceData.activeSessions.length} sessions in progress</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {workspaceData.activeSessions.map((sess) => {
            const isJoined = !!joinedSessions[sess.id];

            return (
              <div
                key={sess.id}
                className="bg-white border-2 border-ink p-6 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between hover:-translate-y-0.5 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-highlight-yellow border border-ink px-2 py-0.5">
                      {sess.type.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-bold text-ink/60 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-ship-green animate-ping" />
                      <span>{sess.startedAt}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-black text-ink mb-2">
                    {sess.title}
                  </h3>

                  <div className="text-xs font-bold text-ink/70 mb-4 font-mono">
                    {sess.targetRepo}
                  </div>

                  {/* Active Participants Avatar Stack */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-ink/50 mb-1.5">Who's in this session</div>
                    <div className="flex items-center space-x-2">
                      {sess.activeParticipants.map(p => (
                        <div key={p.login} className="flex items-center space-x-1 bg-paper-warm border border-ink px-2 py-1 rounded-sm">
                          <img src={p.avatarUrl} alt={p.name} className="w-4 h-4 rounded-full border border-ink" />
                          <span className="text-xs font-bold text-ink">{p.name}</span>
                          {p.status === 'speaking' && <span className="text-[10px] text-ai-blue font-black">🎙</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-ink/10 flex items-center space-x-2">
                  <button
                    onClick={() => toggleSession(sess.id, sess.title)}
                    className={`flex-1 py-2 font-display font-black uppercase text-xs border-2 border-ink transition ${
                      isJoined
                        ? 'bg-ship-green text-white shadow-none'
                        : 'bg-ink text-paper-warm shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none'
                    }`}
                  >
                    {isJoined ? "You're in (Leave)" : 'Jump in'}
                  </button>
                  {sess.prOrIssueId && (
                    <Link
                      to="/react/react/pull/28271"
                      className="px-3 py-2 bg-white border-2 border-ink text-ink font-bold text-xs shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center"
                      title="View the change being discussed"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Managed Projects & Live Team Presence */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-3">Projects your team is working on</div>
          <div className="space-y-4">
            {workspaceData.pinnedProjects.map(proj => (
              <div
                key={proj.name}
                className="bg-white border-2 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Link to="/react/react" className="font-display font-black text-xl text-ink hover:underline">
                      {proj.name}
                    </Link>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-ink bg-[#c8e6c9] text-[#1b5e20]">
                      {proj.health}
                    </span>
                  </div>
                  <p className="text-xs text-ink/70 font-medium mt-1">{proj.description}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-display font-black text-lg text-ink block">{proj.pendingReviews}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink/60">changes waiting for review</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-3">Who's online now</div>
          <div className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] space-y-3">
            {workspaceData.teamMembers.map(m => (
              <div key={m.login} className="flex items-center justify-between py-1 border-b border-ink/10 last:border-0">
                <div className="flex items-center space-x-2.5">
                  <div className="relative">
                    <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-full border border-ink" />
                    <div className={`w-2 h-2 rounded-full absolute bottom-0 right-0 border border-ink ${
                      m.isOnline ? 'bg-ship-green' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">{m.name}</div>
                    <div className="text-[10px] font-medium text-ink/60">{m.role}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 border border-ink ${
                  m.isOnline ? 'bg-highlight-yellow text-ink' : 'bg-gray-100 text-gray-500'
                }`}>
                  {m.isOnline ? 'Active' : 'Away'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicWorkspace /> : <StudioWorkspace />;
}
