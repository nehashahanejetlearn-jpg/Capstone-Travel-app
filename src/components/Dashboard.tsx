import React, { useState } from 'react';
import { ITINERARY_DAYS, DESTINATIONS, CURRENCY_RATES } from '../data/travelData';
import { DestinationId } from '../types/travel';
import {
  Clock,
  Navigation,
  Utensils,
  Plane,
  Luggage,
  Calendar,
  CloudSun,
  Coins,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  activeDay: number;
  setActiveDay: (day: number) => void;
  selectedDestinationId: DestinationId;
  onSelectDestination: (id: DestinationId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeDay,
  setActiveDay,
  onSelectDestination,
}) => {
  const currentDayData = ITINERARY_DAYS.find((d) => d.dayNumber === activeDay) || ITINERARY_DAYS[0];
  const currentDestination = DESTINATIONS.find((d) => d.id === currentDayData.destinationId) || DESTINATIONS[0];

  // Currency quick calculator state
  const [inrAmount, setInrAmount] = useState<number>(5000);
  const [activeSlot, setActiveSlot] = useState<'All' | 'Morning' | 'Afternoon' | 'Evening'>('All');

  const filteredActivities =
    activeSlot === 'All'
      ? currentDayData.activities
      : currentDayData.activities.filter((a) => a.timeSlot === activeSlot);

  // Conversion
  const destCurrency = currentDestination.currency;
  const convertedAmount = (inrAmount / destCurrency.rateToInr).toFixed(1);

  // Total cumulative spent up to this day
  const cumulativeSpentInr = ITINERARY_DAYS.slice(0, activeDay).reduce(
    (acc, day) => acc + day.estimatedDailyExpenseInr + (day.flight?.estimatedFareInr || 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="dashboard-section" className="py-12 md:py-16 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span>Interactive 10-Day Global Schedule</span>
              <span aria-hidden="true">·</span>
              <span>All Expenses in Indian Rupees (₹)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Day-by-Day Master Itinerary
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              title="Print trip sheet for offline travel"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print Day Plan</span>
            </button>
            <div className="text-xs text-slate-400 font-mono">
              Step {activeDay} of 10
            </div>
          </div>
        </div>

        {/* 10-Day Horizontal Timeline Stepper */}
        <div className="relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {ITINERARY_DAYS.map((day) => {
              const isSelected = day.dayNumber === activeDay;
              const dest = DESTINATIONS.find((d) => d.id === day.destinationId);
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setActiveDay(day.dayNumber);
                    onSelectDestination(day.destinationId);
                  }}
                  className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                      DAY {day.dayNumber}
                    </span>
                    <span className="text-sm">{dest?.flag}</span>
                  </div>
                  <div className={`text-xs font-semibold truncate max-w-[120px] ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {day.city}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                    ₹{day.estimatedDailyExpenseInr.toLocaleString('en-IN')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Day Header & Theme */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentDestination.flag}</span>
                <div>
                  <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
                    Day {currentDayData.dayNumber} · {currentDayData.destinationName}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {currentDayData.title}
                  </h3>
                </div>
              </div>

              {/* Day Nav Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={activeDay === 1}
                  onClick={() => {
                    const next = Math.max(1, activeDay - 1);
                    setActiveDay(next);
                    const dest = ITINERARY_DAYS[next - 1].destinationId;
                    onSelectDestination(dest);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
                  aria-label="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={activeDay === 10}
                  onClick={() => {
                    const next = Math.min(10, activeDay + 1);
                    setActiveDay(next);
                    const dest = ITINERARY_DAYS[next - 1].destinationId;
                    onSelectDestination(dest);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
                  aria-label="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Destination Snapshot Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Daily Budget</span>
                </div>
                <div className="text-sm font-bold text-white tabular-nums">
                  ₹{currentDayData.estimatedDailyExpenseInr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400">Excl. flights</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1">
                  <CloudSun className="w-3.5 h-3.5" />
                  <span>Weather</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentDestination.weather.temp.split(' - ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentDestination.weather.condition}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Visa Status</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentDestination.visaInfo.status}
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentDestination.visaInfo.feeInr === 0 ? '₹0 Free Entry' : `₹${currentDestination.visaInfo.feeInr}`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium mb-1">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Veg / Jain Food</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentDestination.indianFriendlyTips.vegFoodEase}
                </div>
                <div className="text-[10px] text-slate-400">Jain options ready</div>
              </div>
            </div>

            {/* Insider Secret Banner */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200">
                <span className="font-semibold text-cyan-300">Indian Explorer Secret: </span>
                {currentDayData.insiderSecret}
              </div>
            </div>
          </div>

          {/* Quick Currency Converter Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Currency Calculator
                </span>
                <span className="text-xs font-mono text-slate-400">
                  1 {destCurrency.code} ≈ ₹{destCurrency.rateToInr}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                INR (₹) to {destCurrency.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Real-time rate for planning daily expenses in {currentDestination.country}.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Amount in Indian Rupees (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={inrAmount}
                    onChange={(e) => setInrAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                    placeholder="Enter INR"
                  />
                </div>
              </div>

              {/* Conversion Result Display */}
              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">You Receive in {destCurrency.code}</div>
                  <div className="text-lg font-bold text-cyan-300 font-mono tabular-nums">
                    {destCurrency.symbol} {convertedAmount} {destCurrency.code}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Preset Tiers</div>
                  <div className="flex gap-1 mt-1">
                    {[2000, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setInrAmount(amt)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          inrAmount === amt
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        ₹{amt / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Cumulative spent:</span>
              <span className="font-mono text-white font-bold tabular-nums">
                ₹{cumulativeSpentInr.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Realistic Flight Boarding Pass (For Flight Days) */}
        {currentDayData.flight && (
          <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl relative">
            <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Flight Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                    SCHEDULED FLIGHT
                  </span>
                  <span className="text-xs text-slate-400">
                    Day {currentDayData.dayNumber} Flight Transfer
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Plane className="w-5 h-5 text-amber-400" />
                  <span>{currentDayData.flight.airline}</span>
                  <span className="text-xs font-mono text-slate-400">({currentDayData.flight.flightNo})</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Luggage className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{currentDayData.flight.baggageAllowance}</span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-amber-300 font-mono">
                    Est. Fare: ₹{currentDayData.flight.estimatedFareInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Route & Times */}
              <div className="flex items-center gap-4 sm:gap-8 justify-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {currentDayData.flight.originCode}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[100px]">
                    {currentDayData.flight.originCity}
                  </div>
                  <div className="text-xs font-mono text-amber-300 mt-1">
                    {currentDayData.flight.departureTime}
                  </div>
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-slate-400 font-mono mb-1">
                    {currentDayData.flight.duration}
                  </span>
                  <div className="w-24 sm:w-36 h-0.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400 relative">
                    <Plane className="w-3.5 h-3.5 text-cyan-300 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 font-mono">Non-Stop</span>
                </div>

                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {currentDayData.flight.destCode}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[100px]">
                    {currentDayData.flight.destCity}
                  </div>
                  <div className="text-xs font-mono text-amber-300 mt-1">
                    {currentDayData.flight.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Simulated Barcode */}
              <div className="hidden lg:flex flex-col items-end border-l border-slate-800 pl-6">
                <div className="text-[10px] font-mono text-slate-400 mb-1">E-TICKET / GATE PASS</div>
                <div className="h-10 w-28 bg-white/90 rounded p-1 flex items-center justify-between">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-slate-950 ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}
                    />
                  ))}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1">EXP-10D-IND</div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Time Slot Filters */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['All', 'Morning', 'Afternoon', 'Evening'] as const).map((slot) => (
              <button
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeSlot === slot
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {slot} Activities
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            {filteredActivities.length} Planned Segments
          </div>
        </div>

        {/* Detailed Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {activity.timeSlot.toUpperCase()}
                  </span>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activity.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Navigation className="w-3.5 h-3.5 text-sky-400" />
                    <span>{activity.transportTime} via {activity.transportMode}</span>
                  </div>
                  <div className="font-mono font-bold text-amber-400 tabular-nums">
                    {activity.costInr === 0 ? 'Free Entry' : `₹${activity.costInr.toLocaleString('en-IN')}`}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-1.5">
                  {activity.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* Highlights & Indian Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Highlights & Duration ({activity.duration})</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {activity.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20">
                  <div className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Smart Tip for Indian Travellers</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activity.tipsForIndians}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Recommended Meals (Breakfast, Lunch, Dinner with Veg/Jain tips) */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" />
              <span>Curated Daily Meals & Pure Vegetarian Guide</span>
            </h4>
            <span className="text-xs text-slate-400">All prices in INR</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentDayData.meals.map((meal, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-cyan-300 uppercase">
                    {meal.meal}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {meal.isVegetarian && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                        Veg
                      </span>
                    )}
                    {meal.jainFriendly && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-medium">
                        Jain
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-white">{meal.name}</div>
                <div className="text-xs text-slate-400">{meal.cuisine}</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {meal.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate max-w-[150px]">
                    📍 {meal.recommendedPlace}
                  </span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    {meal.costInr === 0 ? 'Included' : `₹${meal.costInr}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
