import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore, Toast } from './store';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import ProfilePage from './pages/ProfilePage';
import RepoPage from './pages/RepoPage';
import PRPage from './pages/PRPage';
import PRFilesPage from './pages/PRFilesPage';
import LaunchPage from './pages/LaunchPage';
import BrandPage from './pages/BrandPage';
import PlaceholderPage from './pages/PlaceholderPage';
import BlobPage from './pages/BlobPage';
import SuggestPage from './pages/SuggestPage';
import IssuesPage from './pages/IssuesPage';
import CodespacesPage from './pages/CodespacesPage';
import MarketplacePage from './pages/MarketplacePage';
import ExplorePage from './pages/ExplorePage';
import WorkspacePage from './pages/WorkspacePage';
import DiscussionsPage from './pages/DiscussionsPage';
import ProjectsPage from './pages/ProjectsPage';
import PackagesPage from './pages/PackagesPage';
import PullsPage from './pages/PullsPage';
import RepositoriesPage from './pages/RepositoriesPage';

// Components
import Shell from './components/Shell';
import SplashReveal from './components/SplashReveal';
import OnboardingModal from './components/OnboardingModal';
import PresenterControls from './components/PresenterControls';
import GuidedTour from './components/GuidedTour';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ToastRenderer() {
  const { toasts, lens } = useAppStore();
  const isClassic = lens === 'classic';
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast: Toast) => (
          <motion.div 
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-4 py-3 pointer-events-auto flex items-center space-x-2 text-xs transition-all ${
              isClassic
                ? toast.type === 'success'
                  ? 'bg-[#238636] text-white border border-[#2ea043] rounded-md shadow-lg font-classic'
                  : 'bg-[#161b22] text-[#f0f6fc] border border-gray-700 rounded-md shadow-xl font-classic'
                : toast.type === 'success'
                  ? 'bg-ship-green text-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] font-bold uppercase tracking-wide'
                  : 'bg-ink text-paper-warm border-2 border-ink shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] font-bold uppercase tracking-wide'
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const { lens, toggleLens, onboarded, startTour } = useAppStore();

  // Auto-start the guided tour the first time a user completes onboarding
  const didAutoStart = React.useRef(false);
  useEffect(() => {
    if (onboarded && !didAutoStart.current) {
      didAutoStart.current = true;
      // Brief delay so onboarding modal fully exits first
      const t = setTimeout(() => startTour(), 600);
      return () => clearTimeout(t);
    }
  }, [onboarded, startTour]);

  useEffect(() => {
    document.title = `GitHub ${lens === 'studio' ? 'Studio' : 'Classic'}`;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'm') {
        toggleLens();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lens, toggleLens]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={`min-h-screen flex flex-col ${lens === 'studio' ? 'font-people bg-paper-warm text-ink' : 'font-classic bg-canvas text-paper'}`}>
        <SplashReveal />
        <OnboardingModal />
        
        <Shell>
          <Routes>
            <Route path="/" element={<Navigate to="/react/react" replace />} />
            <Route path="/pulls" element={<PullsPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/codespaces" element={<CodespacesPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/discussions" element={<DiscussionsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/repositories" element={<RepositoriesPage />} />
            <Route path="/:user" element={<ProfilePage />} />
            <Route path="/:owner/:repo" element={<RepoPage />} />
            <Route path="/:owner/:repo/pull/:id" element={<PRPage />} />
            <Route path="/:owner/:repo/pull/:id/changes" element={<PRFilesPage />} />
            <Route path="/:owner/:repo/blob/*" element={<BlobPage />} />
            <Route path="/:owner/:repo/suggest" element={<SuggestPage />} />
            <Route path="/launch" element={<LaunchPage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Routes>
        </Shell>
        
        <GuidedTour />
        <PresenterControls />
        <ToastRenderer />
      </div>
    </BrowserRouter>
  );
}

