// Strictly defined categories for Sawera Sweets & Bakers
// Rule: Only sweets, bakery, grocery/kiryana, cosmetics/personal care, perfumes, and beverages.

export const CATEGORIES = [
  {
    id: "sweets",
    slug: "sweets",
    name: "Sweets",
    displayName: "Sweets (Mithai)",
    urduName: "مٹھائی",
    description: "Traditional sweets prepared fresh with pure desi ghee and khoya.",
    image: "/images/categories/sweets.jpg",
    icon: "UtensilsCrossed",
    badge: "Specialty",
    color: "#07643D",
    featuredSubcategories: ["Gulab Jamun", "Barfi & Peda", "Laddoo", "Rasgulla", "Halwa Jaat", "Special Mix Mithai"]
  },
  {
    id: "bakery",
    slug: "bakery",
    name: "Fresh Bakery",
    displayName: "Fresh Bakery",
    urduName: "تازہ بیکری",
    description: "Oven-fresh cakes, biscuits, cookies, patties, rusks, and breads baked daily.",
    image: "/images/categories/bakery.jpg",
    icon: "Cake",
    badge: "Baked Daily",
    color: "#A5841D",
    featuredSubcategories: ["Fresh Cream Cakes", "Biscuits & Cookies", "Patties & Pastries", "Crispy Rusks", "Breads & Buns"]
  },
  {
    id: "grocery",
    slug: "grocery",
    name: "Kiryana & Grocery",
    displayName: "Kiryana & Grocery",
    urduName: "کریانہ و راشن",
    description: "High quality daily kitchen essentials, rice, flour, pulses, pure ghee, and spices.",
    image: "/images/categories/grocery.jpg",
    icon: "ShoppingBag",
    badge: "Kitchen Essentials",
    color: "#07643D",
    featuredSubcategories: ["Rice & Flour", "Pure Ghee & Oil", "Pulses & Dal", "Spices & Masala", "Tea & Sugar"]
  },
  {
    id: "cosmetics",
    slug: "cosmetics",
    name: "Cosmetics & Personal Care",
    displayName: "Cosmetics & Personal Care",
    urduName: "کاسمیٹکس و پرسنل کیئر",
    description: "Daily skin care, facial cleansers, nourishing lotions, soaps, and shampoos.",
    image: "/images/categories/cosmetics.jpg",
    icon: "Sparkles",
    badge: "Daily Care",
    color: "#A5841D",
    featuredSubcategories: ["Face Washes", "Creams & Lotions", "Bathing Soaps", "Hair Shampoos", "Skin Care Essentials"]
  },
  {
    id: "perfumes",
    slug: "perfumes",
    name: "Perfumes & Fragrances",
    displayName: "Perfumes & Fragrances",
    urduName: "خوشبویات و عطر",
    description: "Concentrated non-alcoholic attars, fine fragrances, and refreshing body sprays.",
    image: "/images/categories/perfumes.jpg",
    icon: "Flame",
    badge: "Fragrances",
    color: "#07643D",
    featuredSubcategories: ["Pure Non-Alcoholic Attar", "Body Sprays", "Premium Perfumes", "Room & Linen Fresheners"]
  },
  {
    id: "beverages",
    slug: "beverages",
    name: "Cold Drinks & Beverages",
    displayName: "Cold Drinks & Beverages",
    urduName: "کولڈ ڈرنکس و مشروبات",
    description: "Chilled sodas, pure bottled mineral water, juices, and flavored refreshments.",
    image: "/images/categories/beverages.jpg",
    icon: "Coffee",
    badge: "Chilled",
    color: "#A5841D",
    featuredSubcategories: ["Cold Drinks & Soda", "Mineral Water", "Fruit Juices", "Flavored Milk", "Energy Drinks"]
  }
];

export const getCategoryBySlug = (slug) => {
  return CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
};
