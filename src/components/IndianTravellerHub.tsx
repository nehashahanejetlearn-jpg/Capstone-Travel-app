import React, { useState } from 'react';
import { DESTINATIONS, INDIAN_PACKING_LIST } from '../data/travelData';
import {
  ShieldCheck,
  Utensils,
  CheckSquare,
  CreditCard,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Luggage,
  HelpCircle,
  Coins
} from 'lucide-react';

export const IndianTravellerHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visa' | 'food' | 'packing' | 'forex'>('visa');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const totalPackingItems = INDIAN_PACKING_LIST.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );
  const packedCount = Object.values(checkedItems).filter(Boolean).length;
  const packedPercentage = Math.round((packedCount / totalPackingItems) * 100);

  return (
    <section id="indian-guide-section" className="py-16 md:py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <span>Tailored for Indian Passports & Lifestyles</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Confusion Travel Prep</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Indian Traveller Toolkit
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Everything Indian families, solo explorers, and first-time flyers need: verified visa pathways, pure-veg and Jain dining locators, forex rules, and custom travel checklists.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('visa')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'visa'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Visa on Indian Passport</span>
          </button>

          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'food'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Pure Veg & Jain Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'packing'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Interactive Packing List ({packedPercentage}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('forex')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'forex'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Forex, Cards & Cash</span>
          </button>
        </div>

        {/* Tab 1: Visa Requirements */}
        {activeTab === 'visa' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DESTINATIONS.map((dest) => (
                <div
                  key={dest.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{dest.flag}</span>
                        <span className="font-bold text-white text-base">{dest.country}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {dest.visaInfo.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      {dest.visaInfo.details}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Government Fee:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {dest.visaInfo.feeInr === 0 ? '₹0 Free Entry' : `₹${dest.visaInfo.feeInr.toLocaleString('en-IN')}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Processing Time:</span>
                      <span className="text-slate-200 font-medium">
                        {dest.visaInfo.processingTime}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Mandatory Documents
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {dest.visaInfo.docsNeeded.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-400" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crucial Indian Passport Notice */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200 space-y-1">
                <span className="font-bold text-amber-300">Indian Immigration Rule of Thumb: </span>
                Your passport must have at least 6 months validity remaining on the date of departure and at least 3 blank pages for immigration stamps. Keep printed copies of all hotel vouchers and return flights handy in your carry-on pouch.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pure Veg & Jain Food Guide */}
        {activeTab === 'food' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DESTINATIONS.map((dest) => (
                <div
                  key={dest.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{dest.flag}</span>
                      <span className="font-bold text-white text-base">{dest.country}</span>
                    </div>
                    <span className="text-xs text-cyan-300 font-medium">
                      {dest.indianFriendlyTips.vegFoodEase} to find
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-amber-300">
                      Top Pure-Veg & Indian Spots:
                    </div>
                    <ul className="text-xs text-slate-200 space-y-1.5">
                      {dest.indianFriendlyTips.popularIndianSpots.map((spot, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 shrink-0">📍</span>
                          <span>{spot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Jain Friendly Options: Verified</span>
                    </div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      {dest.indianFriendlyTips.languageNotes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Local Language Phrases Cheat Sheet */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Vegetarian Food Phrases For Street Vendors & Restaurants</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">Thailand (Thai)</div>
                  <div className="text-slate-200 font-mono">"Kin Jay" (กินเจ)</div>
                  <div className="text-[11px] text-slate-400 mt-1">Strict vegetarian/vegan with no garlic, onion, or fish sauce.</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">Malaysia & Indonesia (Malay)</div>
                  <div className="text-slate-200 font-mono">"Saya Vegetarian, Tanpa Daging"</div>
                  <div className="text-[11px] text-slate-400 mt-1">"I am vegetarian, no meat or shrimp paste please."</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">Singapore</div>
                  <div className="text-slate-200 font-mono">"Su Shi" (素食) / Veg Thali</div>
                  <div className="text-[11px] text-slate-400 mt-1">Tamil & English widely spoken; ask for pure veg stalls.</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">Dubai (UAE)</div>
                  <div className="text-slate-200 font-mono">"Nabaati" (نباتي) / Hindi</div>
                  <div className="text-[11px] text-slate-400 mt-1">Almost all restaurant staff understand fluent Hindi!</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Packing List */}
        {activeTab === 'packing' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Progress Bar */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-cyan-400" />
                    <span>Suitcase Packing Tracker</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Checked {packedCount} of {totalPackingItems} critical travel essentials
                  </p>
                </div>
                <div className="text-lg font-bold font-mono text-cyan-300">
                  {packedPercentage}%
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 transition-all duration-300"
                  style={{ width: `${packedPercentage}%` }}
                />
              </div>
            </div>

            {/* Checklist categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INDIAN_PACKING_LIST.map((cat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                >
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {cat.category}
                  </h5>
                  <div className="space-y-2">
                    {cat.items.map((item, idx) => {
                      const isDone = !!checkedItems[item];
                      return (
                        <label
                          key={idx}
                          className="flex items-start gap-2.5 cursor-pointer text-xs group"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleCheck(item)}
                            className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span
                            className={`leading-relaxed transition-colors ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-white'
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Forex, Cards & Cash */}
        {activeTab === 'forex' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>Zero-Forex Markup Cards</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Avoid standard 3.5% + GST bank markup. Recommended cards:
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span><strong>Niyo Global / Equitas:</strong> Zero forex debit card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span><strong>Scapia Federal Credit Card:</strong> Zero forex on all spends</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span><strong>BookMyForex Multi-Currency:</strong> Lock rates beforehand</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                  <Coins className="w-4 h-4" />
                  <span>RBI Cash & Currency Limits</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Guidelines from Reserve Bank of India (RBI) for Indian citizens:
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Up to <strong>$3,000 USD</strong> equivalent in physical foreign cash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Up to <strong>₹25,000 INR</strong> cash in physical currency allowed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Total LRS limit: $250,000 per financial year</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Card Security Protocol</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Before stepping onto your flight from Delhi or Mumbai:
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Enable "International Usage" via your banking app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Set daily contactless & POS transaction limit caps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Always choose to be charged in local currency (not INR) at card terminals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
