export type DestinationId = 'malaysia' | 'singapore' | 'thailand' | 'indonesia' | 'uae';

export interface Destination {
  id: DestinationId;
  name: string;
  city: string;
  country: string;
  flag: string;
  tagline: string;
  image: string;
  lat: number;
  lng: number;
  currency: {
    code: string;
    name: string;
    symbol: string;
    rateToInr: number; // e.g. 1 MYR = 19.2 INR
  };
  weather: {
    temp: string;
    condition: string;
    humidity: string;
    bestTimeToVisit: string;
  };
  visaInfo: {
    status: 'Visa-Free' | 'eVisa Required' | 'Visa on Arrival' | 'e-VoA';
    feeInr: number;
    processingTime: string;
    details: string;
    docsNeeded: string[];
  };
  indianFriendlyTips: {
    vegFoodEase: 'Very Easy' | 'Easy' | 'Moderate';
    popularIndianSpots: string[];
    jainFoodAvailable: boolean;
    languageNotes: string;
  };
  etiquette: {
    dos: string[];
    donts: string[];
    dressCode: string;
    tipping: string;
  };
}

export interface Activity {
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  time: string;
  title: string;
  description: string;
  duration: string;
  transportTime: string;
  transportMode: string;
  costInr: number;
  highlights: string[];
  tipsForIndians: string;
}

export interface DailyMeal {
  meal: 'Breakfast' | 'Lunch' | 'Dinner';
  name: string;
  cuisine: string;
  isVegetarian: boolean;
  jainFriendly: boolean;
  recommendedPlace: string;
  costInr: number;
  description: string;
}

export interface FlightInfo {
  flightNo: string;
  airline: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  baggageAllowance: string;
  estimatedFareInr: number;
}

export interface ItineraryDay {
  dayNumber: number;
  destinationId: DestinationId;
  destinationName: string;
  city: string;
  title: string;
  theme: string;
  flight?: FlightInfo;
  activities: Activity[];
  meals: DailyMeal[];
  estimatedDailyExpenseInr: number;
  insiderSecret: string;
}

export interface BudgetTier {
  id: 'budget' | 'comfort' | 'luxury';
  name: string;
  subtitle: string;
  totalInr: number;
  flightsInr: number;
  hotelsInr: number;
  foodInr: number;
  activitiesInr: number;
  transfersVisaInr: number;
  perDayInr: number;
  description: string;
}
