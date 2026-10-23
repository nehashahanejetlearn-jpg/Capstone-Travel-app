import React from 'react';
import { Plane, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  onStartJourney: () => void;
  onOpenAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartJourney, onOpenAssistant }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#050b14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <a
          href="#"
          className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-sky-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-4 h-4 text-slate-950 -rotate-45" />
          </div>
          <span className="font-display">The Ultimate Explorer</span>
        </a>

        {/* Zone 2: 4-5 Concise Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#globe-section"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            3D Route
          </a>
          <a
            href="#dashboard-section"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Day Schedule
          </a>
          <a
            href="#destinations-section"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Destinations
          </a>
          <a
            href="#indian-guide-section"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Indian Traveller Hub
          </a>
          <a
            href="#budget-section"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Cost Estimator
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Explorer Tips</span>
          </button>

          <button
            onClick={onStartJourney}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            Start My Journey
          </button>
        </div>
      </div>
    </header>
  );
};
