import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { FileCode2, Edit3, Check, X, GitPullRequest } from 'lucide-react';

const initialMockCode = `
import { useLayoutEffect, useEffect } from 'react';

export function useIsomorphicLayoutEffect(fn, deps) {
  if (typeof window !== 'undefined') {
    useLayoutEffect(fn, deps);
  } else {
    useEffect(fn, deps);
  }
}

export default function Component() {
  useIsomorphicLayoutEffect(() => {
    console.log('Hydrated!');
  }, []);
  return <div>Component</div>;
}
`.trim();

export default function BlobPage() {
  const { owner, repo, '*': path } = useParams();
  const { lens, addToast } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(initialMockCode);
  const [commitMessage, setCommitMessage] = useState(`Update ${path || 'file'}`);

  const handleProposeChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    addToast('File changes proposed successfully! Pull request updated.', 'success');
  };

  const lineCount = code.split('\n').length;

  if (lens === 'classic') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 font-classic">
        <div className="flex items-center space-x-2 text-xl mb-6">
          <Link to={`/${owner}/${repo}`} className="text-blue-400 font-bold hover:underline">{repo}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-white">{path}</span>
        </div>
        
        <div className="border border-gray-700 rounded-md">
          <div className="bg-[#161b22] px-4 py-3 border-b border-gray-700 flex items-center justify-between text-sm rounded-t-md">
            <div className="flex items-center space-x-2 text-white">
              <span className="font-semibold">sebmarkbage</span>
              <span className="text-gray-400">Update {path}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-400">2 hours ago</div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-gray-600 px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Cancel editing
                </button>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="bg-[#0d1117] p-4 overflow-x-auto">
              <pre className="font-code text-sm text-gray-300">
                {code.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 text-right pr-4 text-gray-600 select-none">{i + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          ) : (
            <form onSubmit={handleProposeChanges} className="bg-[#0d1117] p-4 space-y-4">
              <div className="flex text-xs font-mono text-gray-400 border border-gray-700 rounded bg-[#161b22]">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={Math.max(12, lineCount + 2)}
                  className="w-full p-4 bg-transparent text-gray-200 outline-none font-code text-sm resize-y leading-relaxed"
                  autoFocus
                />
              </div>

              <div className="p-4 border border-gray-700 rounded bg-[#161b22] space-y-3">
                <h4 className="text-white text-sm font-semibold flex items-center space-x-2">
                  <GitPullRequest size={16} className="text-green-400" />
                  <span>Propose changes</span>
                </h4>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Commit message"
                  className="w-full px-3 py-1.5 bg-[#0d1117] border border-gray-700 rounded text-sm text-white focus:border-blue-500 outline-none"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded text-xs font-semibold hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-xs font-semibold shadow"
                  >
                    Propose file changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-people studio-texture">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">
          <Link to={`/${owner}/${repo}`} className="hover:text-ink">{repo}</Link>
          <span>/</span>
          <span className="text-ink">{path}</span>
        </div>
        <h1 className="text-4xl font-display font-black uppercase tracking-tight text-ink">
          {path?.split('/').pop()}
        </h1>
      </div>

      <div className="bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
        <div className="border-b-2 border-ink p-4 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2 font-bold text-sm uppercase">
            <FileCode2 size={16} /> <span>{lineCount} lines</span>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-ink text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide border-2 border-transparent hover:bg-gray-800 flex items-center space-x-1.5 transition"
            >
              <Edit3 size={14} />
              <span>Edit File</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-review-amber bg-yellow-100 px-2 py-0.5 border border-ink">
                Editing
              </span>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-white text-ink px-3 py-1 text-xs font-bold uppercase border-2 border-ink hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="p-6 overflow-x-auto">
            <pre className="font-code text-sm text-ink">
              {code.split('\n').map((line, i) => (
                <div key={i} className="flex hover:bg-highlight-yellow/20">
                  <span className="w-8 text-right pr-4 text-gray-400 select-none opacity-50 font-bold">{i + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        ) : (
          <form onSubmit={handleProposeChanges} className="p-6 space-y-6">
            <div className="border-2 border-ink bg-yellow-50/30 p-2">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={Math.max(12, lineCount + 2)}
                className="w-full bg-transparent font-code text-sm text-ink outline-none resize-y p-3 leading-relaxed"
                autoFocus
              />
            </div>

            <div className="bg-paper-warm border-2 border-ink p-6 shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
              <div className="flex items-center space-x-2 font-display font-black uppercase text-lg mb-2">
                <GitPullRequest size={18} className="text-merge-purple" />
                <span>Propose File Changes</span>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-4">
                We'll create a new branch in your fork and start a pull request with these adjustments.
              </p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Summary of changes"
                  className="w-full px-3 py-2 bg-white border-2 border-ink font-bold text-sm text-ink outline-none"
                />
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white text-ink border-2 border-ink font-bold uppercase text-xs hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-ship-green text-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] font-display font-black uppercase text-xs hover:translate-y-px hover:shadow-none transition flex items-center space-x-1.5"
                  >
                    <Check size={14} />
                    <span>Propose file changes</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
