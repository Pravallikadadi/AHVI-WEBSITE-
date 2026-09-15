export type FaqCategory = "Getting Started" | "Style" | "Prep & Plan" | "Pricing";

export const faqCategories: FaqCategory[] = ["Getting Started", "Style", "Prep & Plan", "Pricing"];

export type FaqItem = { id: string; category: FaqCategory; question: string; answer: string };

export const faqData: FaqItem[] = [
  { id: "f1", category: "Getting Started", question: "What is AHVI?", answer: "AHVI is your personal AI assistant for STYLE, PREP and PLAN. It helps you decide what to wear, prepare for what's ahead and organise the things that matter in your day." },
  { id: "f2", category: "Getting Started", question: "What does AHVI help with?", answer: "AHVI brings together styling, preparation and planning. You can use it for your wardrobe, AI styling, Style Boards, Daily Wear, Try-On, packing, skincare, MediTracker, diet and fitness, events, planning, calendar, bills, meals, workouts and routines." },
  { id: "f3", category: "Style", question: "How does AHVI's AI Stylist work?", answer: "Tell AHVI what you're looking for, what you're dressing for, or what you already own. AHVI uses your wardrobe and context to help create personalised styling suggestions." },
  { id: "f4", category: "Style", question: "What is the AHVI Wardrobe?", answer: "Wardrobe is your digital closet inside AHVI. Add your clothing and personal items so AHVI can understand what you own and use those pieces when creating styling suggestions." },
  { id: "f5", category: "Style", question: "What are Style Boards?", answer: "Style Boards let you collect and organise outfit ideas around different moods, occasions and needs. You can create and save looks and return to them whenever you need inspiration. Existing AHVI board labels include Workday, Weekend, Travel, Dinner and Minimal." },
  { id: "f6", category: "Style", question: "What is Daily Wear?", answer: "Daily Wear helps you decide what to wear for the day. AHVI can consider your plans and context to help you find an outfit that fits the moment." },
  { id: "f7", category: "Style", question: "What is Style This?", answer: "Style This lets you start with a specific item and explore how it can become part of a complete outfit." },
  { id: "f8", category: "Style", question: "Can I try an outfit before wearing it?", answer: "Yes. AHVI includes a Try-On experience that lets you explore how a selected look comes together before you wear it." },
  { id: "f9", category: "Prep & Plan", question: "What can AHVI help me prepare for?", answer: "AHVI can help with preparation such as packing, skincare, MediTracker, diet and fitness, events and routines." },
  { id: "f10", category: "Prep & Plan", question: "Can AHVI help me plan my day?", answer: "Yes. AHVI includes Today's Plan, Planner and Calendar experiences to help organise your day and upcoming plans." },
  { id: "f11", category: "Prep & Plan", question: "Can AHVI help with meals and workouts?", answer: "Yes. AHVI includes Meal Planning and Workout Planning as part of its broader PREP and PLAN experience." },
  { id: "f12", category: "Prep & Plan", question: "Can AHVI track bills?", answer: "Yes. AHVI includes a Bills experience for keeping bills and upcoming payments organised alongside your other plans." },
  { id: "f13", category: "Prep & Plan", question: "How do Style, Prep and Plan connect?", answer: "AHVI is designed so these areas aren't isolated. For example, an event in your calendar can influence what you wear and what you need to prepare. A trip can influence your outfit choices, packing list and schedule. That's the idea behind Style. Prep. Plan." },
  { id: "f14", category: "Getting Started", question: "Is AHVI just a fashion app?", answer: "No. Fashion and personal styling are an important part of AHVI, but AHVI goes beyond what you wear. It connects style with preparation, routines, planning and everyday life." },
  { id: "f15", category: "Pricing", question: "How much does AHVI cost?", answer: "AHVI offers 7 days free, then ₹499/month after the trial. Cancel anytime." },
  { id: "f16", category: "Getting Started", question: "How do I get started?", answer: "Start with AHVI and begin building your personal experience. Add your wardrobe, explore your styling options and use AHVI to organise the things you're preparing for and planning." },
];
