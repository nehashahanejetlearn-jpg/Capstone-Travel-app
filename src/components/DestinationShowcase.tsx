import React, { useState } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { Destination, DestinationId } from '../types/travel';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Coins,
  CheckCircle2,
  XCircle,
  X,
  Sparkles
} from 'lucide-react';

interface DestinationShowcaseProps {
  selectedDestinationId: DestinationId;
  onSelectDestination: (id: DestinationId) => void;
  onJumpToDay: (day: number) => void;
}

export const DestinationShowcase: React.FC<DestinationShowcaseProps> = ({
  selectedDestinationId,
  onSelectDestination,
  onJumpToDay,
}) => {
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  // Mapping destination to its starting day in the 10-day tour
  const destStartDays: Record<DestinationId, number> = {
    malaysia: 1,
    singapore: 3,
    thailand: 5,
    indonesia: 7,
    uae: 9,
  };

  return (
    <section id="destinations-section" className="py-16 md:py-20 border-b border-slate-800/80 bg-[#040812]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>The 5 Epic Wonderlands</span>
            <span aria-hidden="true">·</span>
            <span>2 Days in Each Destination</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated International Destinations
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            From the futuristic super-structures of Kuala Lumpur and Singapore, to the ancient gilded temples of Bangkok, the tropical jungle soul of Bali, and the record-breaking splendor of Dubai.
          </p>
        </div>

        {/* 5 Destination Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest, index) => {
            const isSelected = dest.id === selectedDestinationId;
            const startDay = destStartDays[dest.id];
            const isMarquee = index === 0 || index === 4;

            return (
              <div
                key={dest.id}
                className={`group rounded-2xl overflow-hidden bg-slate-900/80 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 shadow-xl shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'border-slate-800 hover:border-slate-700'
                } ${isMarquee ? 'lg:col-span-1' : ''}`}
              >
                {/* Image Container with Contrast Scrim */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
                  <img
                    src={dest.image}
                    alt={`${dest.country} - ${dest.city} travel scenery`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if image load error occurs
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Subtle Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono">
                      DAYS {startDay}-{startDay + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-xs bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-300 font-mono">
                      {dest.currency.symbol} 1 ≈ ₹{dest.currency.rateToInr}
                    </span>
                  </div>

                  {/* Title on Scrim */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <span>{dest.flag}</span>
                      <span>{dest.country}</span>
                    </div>
                    <div className="text-xs text-cyan-300 font-medium">
                      {dest.city} · {dest.tagline}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Key specs */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="text-slate-400">Indian Visa:</span>
                      <span className="font-semibold text-emerald-400">
                        {dest.visaInfo.status} ({dest.visaInfo.feeInr === 0 ? '₹0 Free' : `₹${dest.visaInfo.feeInr}`})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="text-slate-400">Indian Vegetarian:</span>
                      <span className="font-semibold text-cyan-300">
                        {dest.indianFriendlyTips.vegFoodEase} · Jain Friendly
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="text-slate-400">Weather & Temp:</span>
                      <span className="font-medium text-slate-200">
                        {dest.weather.temp}
                      </span>
                    </div>
                  </div>

                  {/* Top Indian Food Spot */}
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                    <div className="text-[10px] text-amber-400 font-semibold mb-0.5 uppercase tracking-wider">
                      Popular Indian Spot
                    </div>
                    <div className="truncate text-slate-200">
                      🍽️ {dest.indianFriendlyTips.popularIndianSpots[0]}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectDestination(dest.id);
                        onJumpToDay(startDay);
                        const el = document.getElementById('dashboard-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Days {startDay}-{startDay + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveModalDest(dest)}
                      className="py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                      title="View Cultural Etiquette & Do's and Don'ts"
                    >
                      Do's & Don'ts
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cultural Etiquette Modal */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeModalDest.flag}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {activeModalDest.country} · Cultural Etiquette & Traveller Protocol
                  </h3>
                  <div className="text-xs text-cyan-400 font-mono">
                    Essential Do's and Don'ts for Indian Travellers
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalDest(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Do's Section */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Important Do's</span>
                </div>
                <div className="space-y-2">
                  {activeModalDest.etiquette.dos.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-slate-200 text-xs leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don'ts Section */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Important Don'ts (Strict Warnings)</span>
                </div>
                <div className="space-y-2">
                  {activeModalDest.etiquette.donts.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-slate-200 text-xs leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dress Code & Tipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-cyan-300 mb-1">
                    👗 Dress Code Guidelines
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {activeModalDest.etiquette.dressCode}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-amber-300 mb-1">
                    💵 Tipping Protocol
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {activeModalDest.etiquette.tipping}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setActiveModalDest(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                Close Protocol Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
