import React from 'react';
import { ArrowRight, PlaneTakeoff, ShieldCheck, IndianRupee, MapPin } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
  onExploreDestinations: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartJourney, onExploreDestinations }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-800/80">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-sky-600/10 to-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Quiet Category Metadata with subtle separator */}
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-cyan-400">
            <span>Specialized Global Circuit for Indian Travellers</span>
            <span aria-hidden="true">·</span>
            <span>Origin: Mumbai & Delhi Hubs</span>
            <span aria-hidden="true">·</span>
            <span>10-Day Multi-Country Pass</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
            Five Destinations. Ten Days.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
              One Incredible Adventure.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            Discover the world, one unforgettable destination at a time. A seamless, realistic itinerary engineered for families, students, and first-time international explorers from India.
          </p>

          {/* CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 rounded-xl shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start My Journey</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onExploreDestinations}
              className="px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
            >
              View 5 Country Highlights
            </button>
          </div>

          {/* 4-Item Quick Metric Strip */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                <MapPin className="w-4 h-4" />
                <span>5 World Wonders</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">KL · SIN · BKK · Bali · DXB</div>
              <div className="text-xs text-slate-400 mt-0.5">Optimized 2-day stops</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <IndianRupee className="w-4 h-4" />
                <span>Budget Precision</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white tabular-nums">From ₹1,25,000</div>
              <div className="text-xs text-slate-400 mt-0.5">All flights & passes included</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Indian Passports</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">4 Visa-Free / e-VoA</div>
              <div className="text-xs text-slate-400 mt-0.5">Pre-cleared entry steps</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                <PlaneTakeoff className="w-4 h-4" />
                <span>Food & Peace</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">100% Veg & Jain Guide</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified Indian restaurants</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
