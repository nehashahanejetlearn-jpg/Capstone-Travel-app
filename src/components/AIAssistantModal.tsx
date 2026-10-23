import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Compass, HelpCircle } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const PRESET_QUESTIONS = [
  'Can I carry homemade theplas and Indian snacks through international customs?',
  'Is it easy to find pure vegetarian & Jain food near Sentosa and Ubud?',
  'Which eSIM or international roaming works best across all 5 countries?',
  'Do Indian passport holders get Visa on Arrival in Dubai with a US visa?',
  'How much physical cash should I carry vs using a Zero-Forex card?',
];

const CURATED_ANSWERS: Record<string, string> = {
  'theplas': `✅ **Yes, absolutely!** You can legally carry dry Indian snacks (theplas, khakhras, namkeen, biscuits, roasted makhana, mathri) into Malaysia, Singapore, Thailand, Indonesia (Bali), and the UAE, provided:
1. They are dry, fully cooked, and commercially sealed or vacuum-packed in clean ziplock bags.
2. They do NOT contain fresh raw dairy (like loose milk/paneer), raw meat, or fresh raw fruits/vegetables with soil.
3. Always declare food items on arrival cards (e.g. Bali customs ECD QR form) if prompted—customs officials in Singapore and Dubai are very familiar with Indian travelers carrying dry snacks!`,

  'food': `🌱 **Vegetarian & Jain Dining Verdict: Exceptionally Easy!**
- **Singapore & Malaysia:** Large resident Tamil and Indian diaspora. Little India (Serangoon Rd, Singapore) and Brickfields (KL) have world-famous pure veg spots like Saravanaa Bhavan, Komala Vilas, and Kailash Parbat.
- **Bangkok:** Say "Kin Jay" (กินเจ) for strict vegetarian/vegan food. Sukhumvit Soi 11 and Indra Square have over 30 Indian restaurants.
- **Bali:** Balinese Hinduism shares deep Vedic roots. Queens Tandoor, Sitara Ubud, and plant-based cafes like Zest serve exceptional vegetarian and Jain meals without root vegetables.
- **Dubai:** Al Karama and Meena Bazaar are vegetarian heavens with Maharaja Bhog and Rasoi Ghar serving unlimited royal thalis.`,

  'esim': `📶 **Best Multi-Country Connectivity for 10 Days:**
1. **Regional eSIM (Best Value):** Install **Airalo** (Asia regional eSIM covers Malaysia, Singapore, Thailand, Bali for ~$15/10GB) + a separate 5GB UAE eSIM for Dubai (~$10).
2. **Indian Telco International Roaming Packs:**
   - **Airtel World Pass:** 10-day global pack covers all 5 countries on your existing WhatsApp number without changing physical SIMs.
   - **Jio Global Roaming:** Activate multi-country pass via MyJio app before boarding at DEL/BOM.
3. **Airport 5G Kiosks:** Free high-speed 5G tourist SIMs with tourist passes are sold at KLIA, Changi, BKK, and DXB arrivals.`,

  'dubai': `🇦🇪 **Dubai Visa on Arrival for Indian Passport Holders:**
- **YES!** If you hold an ordinary Indian passport valid for 6+ months and have a valid **US Tourist Visa (B1/B2), US Green Card, UK Residence Permit, or EU/Schengen Residence Permit** (valid for at least 6 months), you are eligible for **Visa on Arrival at Dubai Airport (DXB)**!
- Cost: approx AED 120 (~₹2,750) payable at the Marhaba counter inside the terminal.
- Otherwise, a standard 14-day or 30-day UAE tourist eVisa takes just 24 to 48 hours to process online via your airline (Emirates/IndiGo) or travel portal.`,

  'cash': `💳 **Cash vs. Forex Card Master Strategy:**
- **Zero-Forex Card (85% of spends):** Use cards like Niyo Global, Scapia, or BookMyForex for hotels, flights, malls, metro trains, and supermarkets. You pay exact interbank exchange rates with 0% markup.
- **Physical Cash (15% of spends):**
  - Carry ~$200-$300 USD equivalent in cash from India. USD is universally accepted at money changers across KL, Bangkok, and Bali.
  - Keep 500-1000 THB in Bangkok for street food and tuk-tuks.
  - Keep 300,000 IDR (~₹1,600) in Bali for local warungs and beach lounge chairs.
  - Dubai and Singapore are virtually 100% cashless—even a single AED 1 Abra boat ride can be paid via Nol card!`,
};

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Namaste! 🌍 I am your Indian Traveller Explorer Concierge. Ask me anything about visas, vegetarian/Jain food, airport customs, forex cards, or day-by-day logistics across Malaysia, Singapore, Thailand, Bali, and Dubai.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setLoading(true);

    // Check if matching curated answer exists
    const qLower = query.toLowerCase();
    let reply = '';
    if (qLower.includes('thepla') || qLower.includes('snack') || qLower.includes('pickle') || qLower.includes('custom')) {
      reply = CURATED_ANSWERS['theplas'];
    } else if (qLower.includes('veg') || qLower.includes('jain') || qLower.includes('food') || qLower.includes('restaurant')) {
      reply = CURATED_ANSWERS['food'];
    } else if (qLower.includes('sim') || qLower.includes('esim') || qLower.includes('roam') || qLower.includes('data')) {
      reply = CURATED_ANSWERS['esim'];
    } else if (qLower.includes('dubai') || qLower.includes('visa on arrival') || qLower.includes('us visa')) {
      reply = CURATED_ANSWERS['dubai'];
    } else if (qLower.includes('cash') || qLower.includes('forex') || qLower.includes('card') || qLower.includes('currency')) {
      reply = CURATED_ANSWERS['cash'];
    } else {
      reply = `✈️ **Quick Explorer Advice for "${query}":**\n\nFor your 10-day trip covering Malaysia, Singapore, Thailand, Bali, and Dubai:\n• Always keep electronic copies of flight tickets, visas (e-VoA for Bali, MDAC for Malaysia, SG Arrival card), and hotel vouchers saved on Google Drive offline.\n• Carry a universal Type-G travel adapter (compatible with Singapore, Dubai, and Malaysia).\n• For pure vegetarian meals, look for South Indian restaurants or local Buddhist 'Jay' eateries.\n• Feel free to click on any day tab in the Master Itinerary above to see the precise morning, afternoon, and evening schedule with exact INR costs!`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Explorer Concierge</h3>
              <div className="text-[11px] text-cyan-400 font-mono">Specialized Advice for Indian Travellers</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Prompts */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 whitespace-nowrap transition-colors"
            >
              {q.slice(0, 36)}...
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Checking Indian passport rules and local guidelines...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about visas, baggage limits, vegetarian spots, or currency..."
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
