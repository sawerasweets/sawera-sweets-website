// Store Configuration for Sawera Sweets & Bakers
// IMPORTANT BUSINESS RULE:
// All contact details, timings, addresses, delivery fees, and prices are clearly marked 
// placeholders until provided by the shop owner.

export const STORE_CONFIG = {
  name: "Sawera Sweets & Bakers",
  urduName: "سویرا سویٹس اینڈ بیکرز",
  mottoUrdu: "ہر خوشی کیساتھ",
  tagline: "Authentic Sweets, Fresh Bakery & Daily Mart Essentials",
  isDemoMode: false,
  demoNotice: "",

  // Official Business Details
  contact: {
    phone: "0322 7434080",
    phoneDisplay: "0322 7434080",
    whatsapp: "0322 7434080",
    whatsappDisplay: "0322 7434080",
    email: "sawerasweets.pk@gmail.com",
    address: "Gojra Road, Opposite DHQ Hospital, Jhang",
    city: "Jhang",
    googleMapsEmbedUrl: "",
  },

  // Operating Hours
  timings: {
    weekdays: "5:30 AM - 12:00 AM (Midnight)",
    weekends: "5:30 AM - 12:00 AM (Midnight)",
    fridayBreak: "1:00 PM - 2:30 PM",
    note: "Open 7 Days a Week"
  },

  // Order & Delivery terms
  delivery: {
    currency: "Rs.",
    currencyCode: "PKR",
    inCityFee: 180,
    outCityFee: 180,
    standardDeliveryFee: "Rs. 180",
    freeDeliveryMinimum: "Rs. 3,000",
    estimatedDeliveryTime: "30 - 60 Minutes (Jhang City) / 24 - 48 Hours (Other Cities)",
    coverageAreas: "Inside Jhang City & All Pakistan Courier Delivery"
  },

  // Payment Options (No paid gateways yet)
  paymentMethods: [
    { 
      id: "cod", 
      name: "Cash on Delivery (COD)", 
      description: "Pay with cash when your package arrives at your doorstep", 
      active: true 
    },
    { 
      id: "whatsapp", 
      name: "Order via WhatsApp", 
      description: "Send your order summary directly to our shop WhatsApp for immediate local confirmation", 
      active: true 
    },
    { 
      id: "bank_transfer", 
      name: "Direct Bank Transfer / Mobile Wallet", 
      description: "[PAYMENT ACCOUNT DETAILS WILL BE PROVIDED UPON REAL STORE LAUNCH]", 
      active: true 
    }
  ],

  // Guarantees & Features (Core Pillars of Sawera Sweets & Bakers)
  features: [
    {
      title: "100% Fresh Daily",
      titleUrdu: "روزانہ تازہ تیار شدہ",
      description: "Sweets and bakery items prepared fresh daily with traditional recipes."
    },
    {
      title: "Pure Desi Ghee & Premium Ingredients",
      titleUrdu: "خالص دیسی گھی اور معیاری اجزاء",
      description: "Pure khoya, authentic desi ghee, and uncompromising ingredient quality."
    },
    {
      title: "Hygienic Packaging",
      titleUrdu: "صاف ستھری محفوظ پیکنگ",
      description: "Strict hygiene standards and food-grade protective boxes."
    },
    {
      title: "Fast Local Delivery",
      titleUrdu: "فوری لوکل ڈلیوری",
      description: "Prompt delivery service directly to your home address."
    }
  ]
};
