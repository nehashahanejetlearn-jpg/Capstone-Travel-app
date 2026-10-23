import React, { useState } from 'react';
import { BUDGET_TIERS } from '../data/travelData';
import { BudgetTier } from '../types/travel';
import {
  IndianRupee,
  Users,
  Plane,
  Building,
  Utensils,
  Ticket,
  Car,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const BudgetCalculator: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<BudgetTier['id']>('comfort');
  const [travelersCount, setTravelersCount] = useState<number>(2);

  const activeTier = BUDGET_TIERS.find((t) => t.id === selectedTier) || BUDGET_TIERS[1];

  // Calculate totals adjusted by number of travelers (flights and passes scale linearly; hotel rooms shared per 2 travelers)
  const roomCount = Math.ceil(travelersCount / 2);
  const scaledFlights = activeTier.flightsInr * travelersCount;
  const scaledHotels = activeTier.hotelsInr * roomCount;
  const scaledFood = activeTier.foodInr * travelersCount;
  const scaledActivities = activeTier.activitiesInr * travelersCount;
  const scaledTransfers = activeTier.transfersVisaInr * travelersCount;

  const totalCalculatedInr =
    scaledFlights + scaledHotels + scaledFood + scaledActivities + scaledTransfers;
  const perPersonInr = Math.round(totalCalculatedInr / travelersCount);

  return (
    <section id="budget-section" className="py-16 md:py-20 border-b border-slate-800/80 bg-[#040812]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>Transparent Expense Planner</span>
            <span aria-hidden="true">·</span>
            <span>All Rates in Indian Rupees (₹)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive 10-Day Cost Estimator
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Realistically budget your entire multi-country expedition across Malaysia, Singapore, Thailand, Bali, and Dubai with zero hidden surprises.
          </p>
        </div>

        {/* Tier Switcher & Travelers Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTier;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 border-cyan-400 shadow-xl shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    {tier.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-400 text-slate-950">
                      SELECTED
                    </span>
                  )}
                </div>
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  ₹{tier.totalInr.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Approx ₹{tier.perDayInr.toLocaleString('en-IN')} / day (Solo base)
                </div>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {tier.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Calculator & Travelers Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          {/* Left Controls & Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Travelers Count Control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-sm font-bold text-white">Party Size (Indian Travellers)</div>
                  <div className="text-xs text-slate-400">
                    Calculates shared hotel rooms & individual flight tickets
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTravelersCount(num)}
                    className={`w-9 h-9 rounded-lg font-mono font-bold text-sm transition-colors ${
                      travelersCount === num
                        ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorized Expense Breakdown Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Itemized Cost Breakdown ({travelersCount} Traveller{travelersCount > 1 ? 's' : ''}, {roomCount} Room{roomCount > 1 ? 's' : ''})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Plane className="w-4 h-4 text-cyan-400" />
                    <span>International Flights (6 Legs)</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    ₹{scaledFlights.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>Stays & Hotels (9 Nights)</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    ₹{scaledHotels.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <span>Meals & Vegetarian Dining</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    ₹{scaledFood.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Ticket className="w-4 h-4 text-sky-400" />
                    <span>Attractions & Fast-Passes</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    ₹{scaledActivities.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 sm:col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Car className="w-4 h-4 text-purple-400" />
                    <span>Visas, Airport Trains, Grab Taxis & Local SIMs</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    ₹{scaledTransfers.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Total Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Total Projected Outlay
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                  ₹{totalCalculatedInr.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-cyan-300 font-mono mt-1">
                  ≈ ₹{perPersonInr.toLocaleString('en-IN')} per traveller
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes all 5 internal international flight tickets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Burj Khalifa 124th floor + Gardens by the Bay tickets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bali Tourism Levy & e-VoA consular charges</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Money-Saving Hack:</strong> Book multi-city flights on a single airline alliance (e.g. Singapore Airlines + Scoot, or Emirates + flydubai) to save up to ₹18,000 per person on baggage fees!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
