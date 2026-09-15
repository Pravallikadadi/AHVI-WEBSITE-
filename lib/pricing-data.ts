export const pricingConfig = {
  currency: "₹",
  originalPrice: 999,
  offerPrice: 499,
  trialDays: 7,
  billingPeriod: "month",
};

export type PremiumFeature = {
  id: string;
  title: string;
  category: "Style" | "Planning" | "Wellness" | "Life";
  description: string;
  icon: "layers" | "camera" | "shirt" | "calendar-check" | "sparkles" | "dumbbell" | "brain" | "luggage" | "party-popper" | "receipt";
};

export const premiumFeatures: PremiumFeature[] = [
  { id: "style-boards", title: "Style Boards", category: "Style", icon: "layers", description: "Create personalized style collections for different moods, occasions and lifestyles — Workday, Weekend, Travel, Dinner, Minimal." },
  { id: "try-on-uploads", title: "Try-On Uploads", category: "Style", icon: "camera", description: "Upload your photo and explore personalized outfit styling and try-on experiences." },
  { id: "skincare", title: "Skincare", category: "Wellness", icon: "sparkles", description: "Get personalized skincare guidance and routines based on your preferences and lifestyle." },
  { id: "meditracker", title: "Meditracker", category: "Wellness", icon: "brain", description: "Keep track of your meditation and wellness routines in one place." },
  { id: "dailywear-style", title: "Dailywear Style", category: "Style", icon: "shirt", description: "Get personalized everyday outfit suggestions based on your wardrobe and preferences." },
  { id: "bills-tracker", title: "Bills Tracker", category: "Life", icon: "receipt", description: "Keep track of important bills, payments and recurring expenses." },
  { id: "todays-plan", title: "Today's Plan", category: "Planning", icon: "calendar-check", description: "Get a personalized daily plan combining your schedule, styling and everyday priorities." },
  { id: "diet-fitness", title: "Diet & Fitness", category: "Wellness", icon: "dumbbell", description: "Get personalized food, fitness and wellness suggestions based on your goals." },
  { id: "packing-lists", title: "Packing List for Trips", category: "Planning", icon: "luggage", description: "Create smart packing lists based on your destination, trip duration, weather and plans." },
  { id: "events", title: "Events", category: "Planning", icon: "party-popper", description: "Get styling and planning assistance for upcoming events and occasions." },
];
