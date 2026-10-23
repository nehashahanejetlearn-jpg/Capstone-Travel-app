import React from 'react';
import { Plane, Compass, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#03060c] border-t border-slate-800/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold">
                <Plane className="w-3.5 h-3.5 -rotate-45" />
              </div>
              <span className="text-lg font-bold text-white font-display">
                The Ultimate Explorer
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Travel the World in 10 Days — A specialized, realistic multi-country itinerary engineered for travellers from India exploring Malaysia, Singapore, Thailand, Bali, and Dubai.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#globe-section" className="hover:text-cyan-400 transition-colors">
              3D Globe Route
            </a>
            <a href="#dashboard-section" className="hover:text-cyan-400 transition-colors">
              Day Schedule
            </a>
            <a href="#destinations-section" className="hover:text-cyan-400 transition-colors">
              Destinations
            </a>
            <a href="#indian-guide-section" className="hover:text-cyan-400 transition-colors">
              Indian Traveller Hub
            </a>
            <a href="#budget-section" className="hover:text-cyan-400 transition-colors">
              INR Cost Estimator
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} The Ultimate Explorer · Designed for Indian Globetrotters
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Expenses estimated in INR (₹) based on standard 2026 airline and visa tariffs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
