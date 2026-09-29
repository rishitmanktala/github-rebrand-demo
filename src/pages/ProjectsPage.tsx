import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Kanban, CheckCircle2, Clock, AlertCircle, Plus, 
  Sparkles, Calendar, Tag, ArrowRight, User 
} from 'lucide-react';
import projectsData from '../data/projects.json';

function ClassicProjects() {
  const { addToast } = useAppStore();
  const currentProject = projectsData.projects[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-classic bg-canvas text-paper">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-white">Projects</h1>
            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">
              {projectsData.totalProjects} Boards
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Track sprints, roadmap milestones, and multi-repo work streams.
          </p>
        </div>
        <button
          onClick={() => addToast('Opening New Project Dialog', 'info')}
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Active Project Banner */}
      <div className="bg-[#161b22] border border-gray-700 rounded-lg p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{currentProject.title}</h2>
              <span className="text-xs bg-green-950 border border-green-800 text-green-300 px-2 py-0.5 rounded-full">
                {currentProject.state}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl">{currentProject.description}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{currentProject.progress.percentComplete}%</span>
            <span className="text-xs text-gray-400 block">Completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden flex">
          <div
            className="bg-[#238636] h-full"
            style={{ width: `${currentProject.progress.percentComplete}%` }}
            title={`Completed: ${currentProject.progress.percentComplete}%`}
          />
        </div>
      </div>

      {/* Tabular Column Breakdown */}
      <div className="border border-gray-700 rounded-md bg-[#0d1117] overflow-hidden">
        <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 text-sm font-semibold text-gray-200">
          Flight Deck Status Breakdown
        </div>

        <div className="divide-y divide-gray-800">
          {currentProject.columns.map((col) => (
            <div key={col.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white text-base">{col.name}</span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                    {col.cards.length} items
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {col.cards.map((card) => (
                  <div key={card.id} className="bg-[#161b22] border border-gray-700/80 rounded p-3 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="font-mono text-blue-400">{card.identifier}</span>
                        <span>{card.estimate}</span>
                      </div>
                      <div className="font-medium text-white mb-2">{card.title}</div>
                    </div>
                    <div className="flex items-center justify-between text-gray-500 pt-2 border-t border-gray-800">
                      <div className="flex items-center space-x-1">
                        <img src={card.assignee.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                        <span className="text-gray-400">{card.assignee.login}</span>
                      </div>
                      <span>Due {card.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudioProjects() {
  const { addToast } = useAppStore();
  const [columns, setColumns] = useState(projectsData.projects[0].columns);

  const moveCardForward = (colIndex: number, cardId: string) => {
    if (colIndex >= columns.length - 1) {
      addToast('Task is already completed in Done column!', 'info');
      return;
    }

    const cardToMove = columns[colIndex].cards.find(c => c.id === cardId);
    if (!cardToMove) return;

    setColumns(prev => {
      const next = [...prev];
      next[colIndex] = {
        ...next[colIndex],
        cards: next[colIndex].cards.filter(c => c.id !== cardId)
      };
      next[colIndex + 1] = {
        ...next[colIndex + 1],
        cards: [cardToMove, ...next[colIndex + 1].cards]
      };
      return next;
    });

    addToast(`Moved "${cardToMove.title}" to ${columns[colIndex + 1].name}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-people bg-paper-warm text-ink studio-texture">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-block bg-highlight-yellow text-ink border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-widest mb-3">
            Kanban Workshop
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-ink">
            {projectsData.projects[0].title}
          </h1>
          <p className="text-base text-ink/70 font-medium mt-1">
            Interactive mission control. Click any card arrow to advance status across the flight line.
          </p>
        </div>

        <button
          onClick={() => addToast('Opening Card Generator Dialog', 'info')}
          className="bg-ink text-paper-warm px-5 py-3 font-bold uppercase tracking-wider text-xs border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none transition flex items-center justify-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Work Item</span>
        </button>
      </div>

      {/* 4-Column Interactive Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((col, colIdx) => (
          <div key={col.id} className="flex flex-col">
            {/* Column Header */}
            <div className="bg-white border-2 border-ink p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex items-center justify-between">
              <div className="font-display font-black uppercase text-sm tracking-wider text-ink">
                {col.name}
              </div>
              <span className="font-mono text-xs font-black bg-ink text-paper-warm px-2 py-0.5">
                {col.cards.length}
              </span>
            </div>

            {/* Cards Stack */}
            <div className="space-y-4 flex-1">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white border-2 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex flex-col justify-between hover:-translate-y-0.5 transition group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-2">
                      <span className="bg-paper-warm border border-ink/40 px-1.5 py-0.5 font-mono">{card.identifier}</span>
                      <span>{card.estimate}</span>
                    </div>

                    <h4 className="font-display font-black text-sm text-ink mb-3 leading-tight">
                      {card.title}
                    </h4>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.labels.map(l => (
                        <span key={l.name} className="text-[10px] font-black uppercase border border-ink px-1.5 py-0.2 bg-highlight-yellow text-ink">
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-ink/10 text-xs font-bold">
                    <div className="flex items-center space-x-1.5">
                      <img src={card.assignee.avatarUrl} alt="" className="w-5 h-5 rounded-full border border-ink" />
                      <span className="text-[11px] text-ink/70">{card.assignee.login}</span>
                    </div>

                    {colIdx < columns.length - 1 ? (
                      <button
                        onClick={() => moveCardForward(colIdx, card.id)}
                        className="bg-paper-warm hover:bg-highlight-yellow border border-ink px-2 py-1 text-[11px] font-black uppercase flex items-center space-x-1 transition"
                        title="Move to next stage"
                      >
                        <span>Move</span>
                        <ArrowRight size={12} />
                      </button>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-ship-green flex items-center space-x-1">
                        <CheckCircle2 size={12} />
                        <span>Done</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicProjects /> : <StudioProjects />;
}
