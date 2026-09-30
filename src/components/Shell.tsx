import React, { useState } from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Search, Plus, Bell, User, X, HelpCircle, Map, BookOpen, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CreateRepoModal from './CreateRepoModal';
import CreateCodespaceModal from './CreateCodespaceModal';
import GraduationModal from './GraduationModal';

function LensSwitcher() {
  const { lens, setLens, setActiveModal } = useAppStore();
  return (
    <div data-tour="lens-switcher" className="flex items-center space-x-1 bg-gray-800/50 rounded-md p-1 border border-gray-700">
      <button
        onClick={() => setLens('classic')}
        className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${lens === 'classic' ? 'bg-canvas text-paper shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
      >
        Classic
      </button>
      <button
        onClick={() => setLens('studio')}
        className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${lens === 'studio' ? 'bg-paper-warm text-ink shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
      >
        Studio
      </button>
      <div className="w-[1px] h-3.5 bg-gray-600/60 my-auto mx-0.5" />
      <button
        onClick={() => setActiveModal('peek')}
        title="Peek alternate lens (Split View)"
        className="px-2 py-1 text-xs font-semibold rounded-sm transition-colors text-gray-400 hover:text-highlight-yellow flex items-center space-x-1"
      >
        <span>Peek</span>
      </button>
    </div>
  );
}

function Dropdown({ isOpen, onClose, children, className = "" }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, className?: string }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className={`absolute right-0 top-full mt-2 z-50 bg-white border-2 border-ink text-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] ${className}`}>
        {children}
      </div>
    </>
  );
}

function ClassicHeader() {
  const { addToast, notificationsCount, clearNotifications, setActiveModal } = useAppStore();
  const [openMenu, setOpenMenu] = useState<'search'|'bell'|'plus'|'user'|null>(null);
  const navigate = useNavigate();

  const toggle = (menu: 'search'|'bell'|'plus'|'user') => setOpenMenu(openMenu === menu ? null : menu);

  return (
    <header className="bg-canvas text-paper py-4 px-6 flex items-center justify-between border-b border-gray-800 text-sm font-classic relative">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img src="/brand/logo.png" alt="GitHub" className="w-8 h-8 rounded-full" />
        </Link>
        <div className="relative group">
          <input type="text" placeholder="Search or jump to..." className="bg-[#161b22] border border-gray-700 rounded-md px-3 py-1 w-64 text-paper placeholder-gray-500 focus:outline-none focus:border-blue-500" onClick={() => toggle('search')} />
          <div className="absolute right-2 top-1.5 border border-gray-600 rounded px-1 text-xs text-gray-500">/</div>
          {openMenu === 'search' && (
             <div className="absolute top-full left-0 mt-1 w-[400px] z-50 bg-[#161b22] border border-gray-700 rounded-md shadow-xl py-2">
               <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-gray-700">Recent searches</div>
               <Link to="/react/react" className="block px-4 py-2 hover:bg-blue-600 hover:text-white" onClick={() => setOpenMenu(null)}>react/react</Link>
               <Link to="/shadcn" className="block px-4 py-2 hover:bg-blue-600 hover:text-white" onClick={() => setOpenMenu(null)}>shadcn</Link>
             </div>
          )}
          {openMenu === 'search' && <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)}></div>}
        </div>
        <nav className="hidden md:flex space-x-4 font-semibold">
          <Link to="/pulls" className="hover:text-gray-300">Pull requests</Link>
          <Link to="/issues" className="hover:text-gray-300">Issues</Link>
          <Link to="/codespaces" className="hover:text-gray-300">Codespaces</Link>
          <Link to="/marketplace" className="hover:text-gray-300">Marketplace</Link>
          <Link to="/explore" className="hover:text-gray-300">Explore</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4 relative">
        <LensSwitcher />
        <div className="relative">
          <div className="relative cursor-pointer p-1" onClick={() => toggle('bell')}>
            <Bell className="w-4 h-4 text-gray-400 hover:text-gray-200" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full leading-none shadow">
                {notificationsCount}
              </span>
            )}
          </div>
          <Dropdown isOpen={openMenu === 'bell'} onClose={() => setOpenMenu(null)} className="w-80 !bg-[#161b22] !border-gray-700 !text-white !shadow-xl rounded-md overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-700 font-semibold flex justify-between items-center">
              <span>Notifications</span>
              {notificationsCount > 0 ? (
                <span 
                  className="text-blue-400 hover:text-blue-300 cursor-pointer text-xs" 
                  onClick={() => {
                    clearNotifications();
                    addToast('Marked all notifications as read', 'success');
                  }}
                >
                  Mark as read
                </span>
              ) : (
                <span className="text-gray-500 text-xs">Caught up</span>
              )}
            </div>
            {notificationsCount > 0 ? (
              <div className="p-2 divide-y divide-gray-800 text-xs">
                <div 
                  className="p-2 hover:bg-gray-800/50 rounded cursor-pointer transition"
                  onClick={() => { setOpenMenu(null); navigate('/react/react/pull/28271'); }}
                >
                  <div className="font-semibold text-white">facebook/react#28271</div>
                  <div className="text-gray-400">sebmarkbage approved your pull request</div>
                </div>
                <div 
                  className="p-2 hover:bg-gray-800/50 rounded cursor-pointer transition"
                  onClick={() => { setOpenMenu(null); navigate('/discussions'); }}
                >
                  <div className="font-semibold text-white">shadcn/ui#1204</div>
                  <div className="text-gray-400">New button variants RFC discussion</div>
                </div>
                <div 
                  className="p-2 hover:bg-gray-800/50 rounded cursor-pointer transition"
                  onClick={() => { setOpenMenu(null); navigate('/react/react'); }}
                >
                  <div className="font-semibold text-white">Security Update</div>
                  <div className="text-gray-400">All dependabot checks passed</div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 text-xs">All caught up! Zero unread notifications.</div>
            )}
          </Dropdown>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-1 cursor-pointer p-1" onClick={() => toggle('plus')}>
            <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
            <span className="text-xs text-gray-400">▼</span>
          </div>
          <Dropdown isOpen={openMenu === 'plus'} onClose={() => setOpenMenu(null)} className="w-48 !bg-[#161b22] !border-gray-700 !text-white !shadow-xl rounded-md py-1">
             <div className="px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => { setActiveModal('create-repo'); setOpenMenu(null); }}>New repository</div>
             <div className="px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => { setActiveModal('create-repo'); setOpenMenu(null); }}>Import repository</div>
             <div className="px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => { setActiveModal('create-codespace'); setOpenMenu(null); }}>New codespace</div>
          </Dropdown>
        </div>
        <div className="relative">
          <User className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer bg-gray-800 rounded-full" onClick={() => toggle('user')} />
          <Dropdown isOpen={openMenu === 'user'} onClose={() => setOpenMenu(null)} className="w-48 !bg-[#161b22] !border-gray-700 !text-white !shadow-xl rounded-md py-1">
             <div className="px-4 py-2 border-b border-gray-700">
               <div className="text-xs text-gray-400">Signed in as</div>
               <div className="font-bold">demo-user</div>
             </div>
             <div className="py-1">
               <Link to="/shadcn" className="block px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => setOpenMenu(null)}>Your profile</Link>
               <Link to="/repositories" className="block px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => setOpenMenu(null)}>Your repositories</Link>
               <Link to="/projects" className="block px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => setOpenMenu(null)}>Your projects</Link>
               <Link to="/packages" className="block px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm" onClick={() => setOpenMenu(null)}>Your packages</Link>
               <div className="px-4 py-1.5 hover:bg-blue-600 cursor-pointer text-sm text-red-400 border-t border-gray-700 mt-1" onClick={() => { addToast('Signed out of demo session. (Click to Undo)', 'info'); setOpenMenu(null); }}>Sign out</div>
             </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

function StudioHeader() {
  const { addToast, notificationsCount, clearNotifications, setActiveModal } = useAppStore();
  const [openMenu, setOpenMenu] = useState<'search'|'bell'|'plus'|'user'|null>(null);
  const navigate = useNavigate();
  const toggle = (menu: 'search'|'bell'|'plus'|'user') => setOpenMenu(openMenu === menu ? null : menu);

  return (
    <header className="bg-ink text-paper-warm py-4 px-6 flex items-center justify-between border-b border-gray-800 font-people relative">
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/brand/logo.png" alt="GitHub" className="w-8 h-8 rounded-full" />
          <span className="font-display font-black text-xl tracking-tighter uppercase">GITHUB</span>
        </Link>
        <Link to="/launch" className="bg-highlight-yellow text-ink px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-yellow-300 transition">
          v2.0
        </Link>
        <nav className="hidden md:flex space-x-6 font-semibold text-sm text-gray-400">
          <Link to="/workspace" className="text-paper-warm hover:text-white transition">Workspace</Link>
          <Link to="/discussions" className="hover:text-paper-warm transition">Discussions</Link>
          <Link to="/explore" className="hover:text-paper-warm transition">Explore</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-6 relative">
        <LensSwitcher />
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 hover:text-paper-warm cursor-pointer transition" onClick={() => toggle('search')} />
            {openMenu === 'search' && (
              <>
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setOpenMenu(null)}></div>
                <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 bg-paper-warm border-4 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] flex flex-col">
                  <div className="flex items-center border-b-4 border-ink p-4">
                    <Search className="w-6 h-6 text-ink mr-4" />
                    <input type="text" autoFocus placeholder="Search the workshop..." className="flex-1 bg-transparent text-2xl font-display font-black uppercase text-ink outline-none placeholder-gray-400" />
                    <X className="w-6 h-6 text-ink cursor-pointer" onClick={() => setOpenMenu(null)} />
                  </div>
                  <div className="p-4 bg-white">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Recent</div>
                    <Link to="/react/react" className="block px-4 py-3 border-2 border-transparent hover:border-ink font-bold uppercase" onClick={() => setOpenMenu(null)}>react / react</Link>
                    <Link to="/shadcn" className="block px-4 py-3 border-2 border-transparent hover:border-ink font-bold uppercase" onClick={() => setOpenMenu(null)}>shadcn</Link>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <Plus className="w-5 h-5 text-gray-400 hover:text-paper-warm cursor-pointer transition" onClick={() => toggle('plus')} />
            <Dropdown isOpen={openMenu === 'plus'} onClose={() => setOpenMenu(null)} className="w-56 py-1">
              <div className="px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-xs cursor-pointer border-b-2 border-ink" onClick={() => { setActiveModal('create-repo'); setOpenMenu(null); }}>
                New repository
              </div>
              <div className="px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-xs cursor-pointer border-b-2 border-ink" onClick={() => { setActiveModal('create-repo'); setOpenMenu(null); }}>
                Import repository
              </div>
              <div className="px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-xs cursor-pointer" onClick={() => { setActiveModal('create-codespace'); setOpenMenu(null); }}>
                New codespace
              </div>
            </Dropdown>
          </div>
          <div className="relative">
            <div className="relative cursor-pointer p-0.5" onClick={() => toggle('bell')}>
              <Bell className="w-5 h-5 text-gray-400 hover:text-paper-warm transition" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-highlight-yellow text-ink border border-ink text-[10px] font-black px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full leading-none shadow-sm">
                  {notificationsCount}
                </span>
              )}
            </div>
            <Dropdown isOpen={openMenu === 'bell'} onClose={() => setOpenMenu(null)} className="w-80">
              <div className="px-4 py-3 border-b-2 border-ink font-black font-display uppercase flex justify-between items-center bg-highlight-yellow">
                <span>Notifications</span>
                {notificationsCount > 0 ? (
                  <span className="text-ink cursor-pointer text-xs font-bold underline hover:opacity-80" onClick={() => { clearNotifications(); addToast('Cleared all notifications', 'success'); }}>Clear</span>
                ) : (
                  <span className="text-xs text-ink/70 font-semibold">Zero unread</span>
                )}
              </div>
              {notificationsCount > 0 ? (
                <div className="p-2 divide-y-2 divide-ink text-xs font-bold uppercase">
                  <div 
                    className="py-2 hover:bg-highlight-yellow/40 px-2 cursor-pointer transition"
                    onClick={() => { setOpenMenu(null); navigate('/react/react/pull/28271'); }}
                  >
                    <div className="text-ink">facebook / react #28271</div>
                    <div className="text-gray-500 font-normal">Review approved by sebmarkbage</div>
                  </div>
                  <div 
                    className="py-2 hover:bg-highlight-yellow/40 px-2 cursor-pointer transition"
                    onClick={() => { setOpenMenu(null); navigate('/discussions'); }}
                  >
                    <div className="text-ink">shadcn / ui #1204</div>
                    <div className="text-gray-500 font-normal">Mentioned in RFC Discussion</div>
                  </div>
                  <div 
                    className="py-2 hover:bg-highlight-yellow/40 px-2 cursor-pointer transition"
                    onClick={() => { setOpenMenu(null); navigate('/launch'); }}
                  >
                    <div className="text-ink">Studio Release v2.0</div>
                    <div className="text-gray-500 font-normal">Tactile dual-lens enabled</div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm font-bold uppercase">All caught up.</div>
              )}
            </Dropdown>
          </div>
        </div>
        <div className="relative">
          <User className="w-8 h-8 text-ink cursor-pointer bg-highlight-yellow rounded border-2 border-ink" onClick={() => toggle('user')} />
          <Dropdown isOpen={openMenu === 'user'} onClose={() => setOpenMenu(null)} className="w-56 py-2">
             <div className="px-4 py-2 border-b-2 border-ink mb-2">
               <div className="text-xs font-bold uppercase text-gray-500">Signed in as</div>
               <div className="font-display font-black uppercase text-xl">demo-user</div>
             </div>
             <Link to="/shadcn" className="block px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-sm" onClick={() => setOpenMenu(null)}>Your Profile</Link>
             <Link to="/repositories" className="block px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-sm" onClick={() => setOpenMenu(null)}>Your Work</Link>
             <Link to="/projects" className="block px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-sm" onClick={() => setOpenMenu(null)}>Your Projects</Link>
             <Link to="/packages" className="block px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-sm" onClick={() => setOpenMenu(null)}>Your Packages</Link>
             <div className="px-4 py-2 hover:bg-highlight-yellow font-bold uppercase text-sm cursor-pointer border-t-2 border-ink mt-2" onClick={() => { addToast('Signed out of demo session. (Click to Undo)', 'info'); setOpenMenu(null); }}>Sign Out</div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

function PeekModal() {
  const { lens, setLens, activeModal, setActiveModal } = useAppStore();
  if (activeModal !== 'peek') return null;

  const alternateLens = lens === 'classic' ? 'studio' : 'classic';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={() => setActiveModal(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#161b22] border-2 border-gray-700 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-canvas text-paper">
          <div className="flex items-center space-x-3">
            <span className="font-display uppercase font-black text-sm tracking-wider bg-highlight-yellow text-ink px-2.5 py-1 rounded">Dual-Lens Split View</span>
            <span className="text-xs text-gray-400">Current: <span className="text-white font-semibold capitalize">{lens}</span> · Peeking: <span className="text-highlight-yellow font-semibold capitalize">{alternateLens}</span></span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setLens(alternateLens);
                setActiveModal(null);
              }}
              className="bg-ship-green hover:bg-[#2ea043] text-white text-xs font-semibold px-3.5 py-1.5 rounded transition shadow-sm"
            >
              Switch to {alternateLens === 'studio' ? 'Studio' : 'Classic'} Lens
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="text-gray-400 hover:text-white p-1 rounded"
              aria-label="Close peek"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Split View Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-gray-700">
          {/* Classic Pane */}
          <div className={`p-6 bg-canvas text-paper font-classic flex flex-col ${lens === 'classic' ? 'ring-2 ring-blue-500/40' : ''}`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-bold text-sm">Classic — Dark Look</span>
              </div>
              {lens === 'classic' && <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">ACTIVE</span>}
            </div>
            <div className="space-y-4 text-xs">
              <div className="bg-[#161b22] border border-gray-700 rounded p-3">
                <div className="text-gray-400 text-[11px] mb-1 font-semibold">What it is</div>
                <p className="text-gray-200 leading-relaxed">Dark background, compact layout, small text. Designed for people who use GitHub every day and want everything dense and fast — like a power-user's dashboard.</p>
              </div>
              <div className="bg-[#161b22] border border-gray-700 rounded p-3 space-y-2">
                <div className="text-gray-400 text-[11px] font-semibold">Key colours</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 text-[10px] font-mono">Very dark background</span>
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] font-mono">Dark card backgrounds</span>
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-blue-400 text-[10px] font-mono">Blue highlights</span>
                </div>
              </div>
              <div className="bg-[#161b22] border border-gray-700 rounded p-3">
                <div className="text-gray-400 text-[11px] mb-1 font-semibold">Sample: a line of code added</div>
                <div className="font-mono text-[11px] bg-diff-green/20 text-diff-green px-2 py-1 rounded">
                  + export function useDualLens(): LensState;
                </div>
              </div>
            </div>
            {lens !== 'classic' && (
              <button
                onClick={() => { setLens('classic'); setActiveModal(null); }}
                className="mt-6 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded border border-gray-600 text-xs font-semibold transition"
              >
                Switch to Classic
              </button>
            )}
          </div>

          {/* Studio Pane */}
          <div className={`p-6 bg-paper-warm text-ink font-people studio-texture flex flex-col ${lens === 'studio' ? 'ring-2 ring-ink' : ''}`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-ink">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-highlight-yellow border border-ink" />
                <span className="font-display font-black text-sm uppercase">Studio — Light & Bold</span>
              </div>
              {lens === 'studio' && <span className="text-[10px] bg-ink text-paper-warm px-2 py-0.5 font-bold uppercase">ACTIVE</span>}
            </div>
            <div className="space-y-4 text-xs">
              <div className="bg-white border-2 border-ink p-3 shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]">
                <div className="text-ink/60 text-[11px] font-bold uppercase mb-1">What it is</div>
                <p className="font-medium text-ink leading-relaxed">Warm paper background, bold black borders, large friendly text. Built to feel welcoming to designers, writers, and new users — not just coders.</p>
              </div>
              <div className="bg-white border-2 border-ink p-3 shadow-[3px_3px_0px_0px_rgba(10,10,10,1)] space-y-2">
                <div className="text-ink/60 text-[11px] font-bold uppercase">Key colours</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-paper-warm border border-ink text-ink text-[10px] font-bold">Warm Paper</span>
                  <span className="px-2 py-0.5 bg-ship-green text-white text-[10px] font-bold">Shipped Green</span>
                  <span className="px-2 py-0.5 bg-highlight-yellow text-ink text-[10px] font-bold">Highlight Yellow</span>
                  <span className="px-2 py-0.5 bg-merge-purple text-white text-[10px] font-bold">Merge Purple</span>
                </div>
              </div>
              <div className="bg-white border-2 border-ink p-3 shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]">
                <div className="text-ink/60 text-[11px] font-bold uppercase mb-1">Status</div>
                <div className="font-display font-black uppercase text-xs text-ship-green flex items-center space-x-1">
                  <span>● Ready to ship</span>
                </div>
              </div>
            </div>
            {lens !== 'studio' && (
              <button
                onClick={() => { setLens('studio'); setActiveModal(null); }}
                className="mt-6 w-full py-2 bg-ink hover:bg-gray-800 text-paper-warm border-2 border-ink text-xs font-bold uppercase tracking-wider transition shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]"
              >
                Switch to Studio
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function HelpButton() {
  const [open, setOpen] = useState(false);
  const [showWhat, setShowWhat] = useState(false);
  const { startTour, lens } = useAppStore();
  const navigate = useNavigate();

  const isStudio = lens === 'studio';

  const handleStartTour = () => {
    setOpen(false);
    setShowWhat(false);
    navigate('/react/react');
    // Small delay so navigation completes before tour spotlight fires
    setTimeout(() => startTour(), 150);
  };

  return (
    <>
      {/* "What is GitHub?" explainer modal */}
      <AnimatePresence>
        {showWhat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWhat(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className={`max-w-md w-full p-8 relative ${isStudio ? 'bg-paper-warm border-4 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] font-people' : 'bg-[#161b22] border border-gray-700 rounded-xl shadow-2xl font-classic text-white'}`}
            >
              <button
                onClick={() => setShowWhat(false)}
                className={`absolute top-4 right-4 p-1.5 rounded ${isStudio ? 'text-ink hover:bg-gray-200' : 'text-gray-400 hover:text-white'}`}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="text-3xl mb-4">🐙</div>

              <h2 className={`text-xl font-bold mb-3 ${isStudio ? 'font-display uppercase tracking-tight text-ink' : 'text-white'}`}>
                What is GitHub?
              </h2>

              <div className={`space-y-3 text-sm leading-relaxed ${isStudio ? 'text-ink/80' : 'text-gray-300'}`}>
                <p>
                  <strong>GitHub is like Google Docs — but for software.</strong> Instead of documents, people store and share code here. Millions of apps, websites, and tools you use every day were built on GitHub.
                </p>
                <p>
                  Anyone can <strong>suggest a change</strong> to a project (like editing a shared doc), and the team decides whether to accept it. Every accepted change is recorded, so nothing is ever lost.
                </p>
                <p>
                  This demo shows what a <strong>redesigned GitHub</strong> could look like. Everything is clickable — nothing you do here is real, so explore freely.
                </p>
              </div>

              <button
                onClick={handleStartTour}
                className={`mt-6 w-full py-3 text-sm font-bold uppercase tracking-wide transition ${
                  isStudio
                    ? 'bg-ink text-paper-warm border-2 border-ink shadow-[3px_3px_0px_0px_rgba(10,10,10,1)] hover:translate-y-0.5 hover:shadow-none'
                    : 'bg-[#238636] hover:bg-[#2ea043] text-white rounded-md'
                }`}
              >
                Take the guided tour →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating help button + panel */}
      <div className="fixed bottom-6 right-6 z-[190] flex flex-col items-end space-y-2">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`w-64 p-2 ${
                isStudio
                  ? 'bg-paper-warm border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] font-people'
                  : 'bg-[#161b22] border border-gray-700 rounded-xl shadow-2xl font-classic'
              }`}
            >
              {/* Header */}
              <div className={`px-3 py-2 mb-1 text-xs font-bold uppercase tracking-widest ${isStudio ? 'text-ink/50' : 'text-gray-500'}`}>
                Help & Navigation
              </div>

              {/* Option 1: Take the tour */}
              <button
                onClick={handleStartTour}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-left transition rounded-sm ${
                  isStudio
                    ? 'hover:bg-highlight-yellow text-ink'
                    : 'hover:bg-gray-800 text-gray-200'
                }`}
              >
                <PlayCircle size={16} className={isStudio ? 'text-ship-green' : 'text-green-400'} />
                <div>
                  <div className="font-bold">Take the guided tour</div>
                  <div className={`text-xs font-normal ${isStudio ? 'text-ink/60' : 'text-gray-400'}`}>2-minute walkthrough of everything</div>
                </div>
              </button>

              {/* Option 2: What is GitHub */}
              <button
                onClick={() => { setShowWhat(true); setOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-left transition rounded-sm ${
                  isStudio
                    ? 'hover:bg-highlight-yellow text-ink'
                    : 'hover:bg-gray-800 text-gray-200'
                }`}
              >
                <BookOpen size={16} className={isStudio ? 'text-ai-blue' : 'text-blue-400'} />
                <div>
                  <div className="font-bold">What is GitHub?</div>
                  <div className={`text-xs font-normal ${isStudio ? 'text-ink/60' : 'text-gray-400'}`}>Plain-English explanation</div>
                </div>
              </button>

              {/* Option 3: Jump to pages */}
              <div className={`border-t mt-1 pt-1 ${isStudio ? 'border-ink/10' : 'border-gray-800'}`}>
                <div className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${isStudio ? 'text-ink/50' : 'text-gray-500'}`}>
                  Jump to
                </div>
                {[
                  { label: 'A project page', path: '/react/react', desc: 'files & code' },
                  { label: 'A suggested change', path: '/react/react/pull/28271', desc: 'pull request' },
                  { label: 'Team workspace', path: '/workspace', desc: 'live sessions' },
                  { label: 'Community chat', path: '/discussions', desc: 'discussions' },
                  { label: 'A profile', path: '/shadcn', desc: 'contributor page' },
                ].map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 text-sm transition rounded-sm ${
                      isStudio
                        ? 'hover:bg-highlight-yellow text-ink'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className={`text-xs ${isStudio ? 'text-ink/40' : 'text-gray-500'}`}>{item.desc}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The ? button itself */}
        <motion.button
          onClick={() => setOpen(prev => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Help"
          className={`w-12 h-12 flex items-center justify-center transition ${
            open
              ? isStudio
                ? 'bg-ink text-paper-warm border-2 border-ink shadow-none'
                : 'bg-gray-600 text-white rounded-full'
              : isStudio
                ? 'bg-highlight-yellow text-ink border-2 border-ink shadow-[3px_3px_0px_0px_rgba(10,10,10,1)] hover:translate-y-px hover:shadow-none'
                : 'bg-[#238636] hover:bg-[#2ea043] text-white rounded-full shadow-lg'
          }`}
        >
          {open ? <X size={20} /> : <HelpCircle size={22} />}
        </motion.button>
      </div>
    </>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const { lens } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative min-h-[65px]">
        <AnimatePresence mode="wait">
          {lens === 'classic' ? (
            <motion.div key="classic-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-full">
              <ClassicHeader />
            </motion.div>
          ) : (
            <motion.div key="studio-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-full">
              <StudioHeader />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <main className="flex-1 relative z-0">
        {children}
      </main>
      
      {/* Global Modals */}
      <CreateRepoModal />
      <CreateCodespaceModal />
      <GraduationModal />
      <PeekModal />

      {/* Always-visible help button */}
      <HelpButton />

      <footer className={`py-8 text-center text-xs mt-auto relative z-0 transition-colors ${lens === 'classic' ? 'text-gray-500 border-t border-gray-800/30' : 'text-ink/60 border-t-2 border-ink/20 font-people bg-paper-warm'}`}>
        This is a concept demo — not the real GitHub, not affiliated with GitHub, Inc. <br/>
        <span className="opacity-60">Just a vision of what could be. Click anything — it's all safe to explore.</span>
      </footer>
    </div>
  );
}
