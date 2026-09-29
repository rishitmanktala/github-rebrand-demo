import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Construction } from 'lucide-react';

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const { lens } = useAppStore();
  
  const title = pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2).replace(/[\/-]/g, ' ');

  if (lens === 'classic') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 font-classic text-center">
        <div className="bg-[#161b22] border border-gray-700 rounded-md p-12">
          <Construction size={48} className="mx-auto text-gray-500 mb-6" />
          <h1 className="text-2xl font-semibold text-white mb-4">404: {title || 'Page'} not found</h1>
          <p className="text-gray-400 mb-8">This page isn't wired up in the concept demo.</p>
          <Link to="/" className="text-blue-400 hover:underline">Return to repository</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 font-people studio-texture text-center">
      <div className="inline-block bg-highlight-yellow text-ink px-4 py-1 font-bold uppercase tracking-widest text-sm mb-6 border-2 border-ink">
        Work in Progress
      </div>
      <h1 className="text-6xl font-display font-black uppercase tracking-tight text-ink mb-6">
        {title || 'Under Construction'}
      </h1>
      <p className="text-xl text-gray-600 font-light mb-12 max-w-lg mx-auto">
        This area of GitHub Studio is currently being redesigned. Check back later.
      </p>
      <Link to="/" className="inline-block bg-ink text-paper-warm px-8 py-4 font-bold uppercase tracking-wide border-2 border-ink shadow-[4px_4px_0px_0px_rgba(46,160,67,1)] hover:translate-y-1 hover:shadow-none transition">
        Return to Workshop
      </Link>
    </div>
  );
}
