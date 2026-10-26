// Sawera Sweets & Bakers — Occasion-Based Collections Configuration
// Real available products mapped to celebratory customer intents

export const DEFAULT_OCCASIONS = [
  {
    id: "occ-wedding",
    name: "Wedding & Shadi Baarat",
    urduName: "شادی بیاہ اور بارات",
    subtitle: "Custom decorated sweet boxes and bulk celebratory mithai",
    urduSubtitle: "شادی کے سجاوٹی مٹھائی کے ڈبے اور تقاریب کے آرڈرز",
    badge: "Celebration Special",
    urduBadge: "شادی اسپیشل",
    icon: "Heart",
    bgColor: "from-rose-950 via-red-900 to-amber-950",
    productIds: [
      "prd-special-roll-barfi",
      "prd-special-badam-barfi",
      "prd-special-sohan-halwa",
      "prd-paltawa-patisa",
      "prd-special-badam-tafi"
    ],
    isActive: true
  },
  {
    id: "occ-eid",
    name: "Eid & Blessed Festivities",
    urduName: "عید اور بابرکت تہوار",
    subtitle: "Celebrate auspicious days with authentic pure desi ghee halwas and pedas",
    urduSubtitle: "عید کی خوشیوں کو خالص دیسی گھی کی روایتی مٹھاس کے ساتھ دوبالا کریں",
    badge: "Festive Blessed",
    urduBadge: "عید سعید",
    icon: "Sparkles",
    bgColor: "from-emerald-950 via-emerald-900 to-teal-950",
    productIds: [
      "prd-dry-fruit-halwa",
      "prd-special-sohan-halwa",
      "prd-special-coconut-halwa",
      "prd-badami-halwa",
      "prd-shapper-milky-patisa"
    ],
    isActive: true
  },
  {
    id: "occ-hospitality",
    name: "Mehman-Nawazi & Tea Time",
    urduName: "مہمان نوازی اور چائے پارٹی",
    subtitle: "Crisp flaky patisa, tea bakery rusks, and melt-in-mouth barfi for guests",
    urduSubtitle: "خستہ پتیسہ، بادامی برفی اور چائے کے لیے روایتی بیکری",
    badge: "Hospitality Classic",
    urduBadge: "پروقار مہمان نوازی",
    icon: "Coffee",
    bgColor: "from-amber-950 via-amber-900 to-amber-950",
    productIds: [
      "prd-shapper-pista-patisa",
      "prd-shapper-milky-patisa",
      "prd-milky-patisa",
      "prd-dilli-halwa"
    ],
    isActive: true
  },
  {
    id: "occ-vip-gifts",
    name: "VIP Corporate & Family Gifts",
    urduName: "اعزازی اور کارپوریٹ تحائف",
    subtitle: "Handcrafted luxury gift assortments delivered safely with personalized greeting cards",
    urduSubtitle: "باہمی محبت اور احترام کا پروقار اظہار، خصوصی تحفہ کارڈ کے ساتھ",
    badge: "Royal Gifting",
    urduBadge: "شاہی تحفہ",
    icon: "Gift",
    bgColor: "from-emerald-950 via-teal-900 to-amber-950",
    productIds: [
      "prd-special-roll-barfi",
      "prd-special-badam-barfi",
      "prd-dry-fruit-halwa",
      "prd-special-badam-tafi",
      "prd-special-sohan-halwa"
    ],
    isActive: true
  }
];
