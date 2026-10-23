import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Globe3D } from './components/Globe3D';
import { Dashboard } from './components/Dashboard';
import { DestinationShowcase } from './components/DestinationShowcase';
import { IndianTravellerHub } from './components/IndianTravellerHub';
import { BudgetCalculator } from './components/BudgetCalculator';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';
import { DestinationId } from './types/travel';
import { ITINERARY_DAYS } from './data/travelData';
import { Navigation, Globe2, Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [selectedDestinationId, setSelectedDestinationId] = useState<DestinationId>('malaysia');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // When a destination is selected from Globe or Showcase, update active day
  const handleSelectDestination = (id: DestinationId) => {
    setSelectedDestinationId(id);
    const firstDayForDest = ITINERARY_DAYS.find((d) => d.destinationId === id);
    if (firstDayForDest) {
      setActiveDay(firstDayForDest.dayNumber);
    }
  };

  // When user switches day in dashboard
  const handleSelectDay = (day: number) => {
    setActiveDay(day);
    const dayData = ITINERARY_DAYS.find((d) => d.dayNumber === day);
    if (dayData) {
      setSelectedDestinationId(dayData.destinationId);
    }
  };

  const handleStartJourney = () => {
    const el = document.getElementById('globe-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreDestinations = () => {
    const el = document.getElementById('destinations-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 flex flex-col">
      {/* Top Bar Header */}
      <Header
        onStartJourney={handleStartJourney}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartJourney={handleStartJourney}
          onExploreDestinations={handleExploreDestinations}
        />

        {/* 3D Interactive Rotating Globe Section */}
        <section id="globe-section" className="py-12 md:py-16 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span>3D Spatial Journey Visualizer</span>
                  <span aria-hidden="true">·</span>
                  <span>Interactive Flight Arcs</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Global Flight Corridor
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Watch the continuous circuit connecting Mumbai/Delhi ➔ Kuala Lumpur ➔ Singapore ➔ Bangkok ➔ Bali ➔ Dubai ➔ India.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAssistantOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI Explorer Concierge</span>
                </button>
              </div>
            </div>

            {/* 3D WebGL Globe Canvas */}
            <Globe3D
              selectedDestinationId={selectedDestinationId}
              onSelectDestination={handleSelectDestination}
              activeDay={activeDay}
            />
          </div>
        </section>

        {/* Travel Dashboard & Day-by-Day Master Schedule */}
        <Dashboard
          activeDay={activeDay}
          setActiveDay={handleSelectDay}
          selectedDestinationId={selectedDestinationId}
          onSelectDestination={handleSelectDestination}
        />

        {/* 5 Destination Showcase */}
        <DestinationShowcase
          selectedDestinationId={selectedDestinationId}
          onSelectDestination={handleSelectDestination}
          onJumpToDay={handleSelectDay}
        />

        {/* Indian Traveller Hub (Visas, Veg Dining, Packing, Forex) */}
        <IndianTravellerHub />

        {/* Budget Calculator & INR Estimator */}
        <BudgetCalculator />
      </main>

      {/* AI Assistant Concierge Modal */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
