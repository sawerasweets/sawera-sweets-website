// Sawera Sweets & Bakers — Mithai Box Studio Configuration
// Signature Custom Assortment Box Engine

export const DEFAULT_BOX_OPTIONS = [
  {
    id: "box-gold-500g",
    name: "Classic Heritage Box (500g)",
    urduName: "کلاسک ہیریٹیج بکس (۵۰۰ گرام)",
    capacityGrams: 500,
    packagingFee: 50,
    badge: "Popular Gift",
    urduBadge: "پسندیدہ تحفہ",
    description: "Compact gold presentation box with individual freshness compartments for 2 to 4 sweet varieties.",
    urduDescription: "دو سے چار قسم کی مٹھائیوں کے لیے انفرادی خانوں والا خوبصورت گولڈن پریزنٹیشن بکس۔",
    image: "/images/categories/sweets.jpg",
    dimensions: "18 x 14 x 5 cm",
    maxVarieties: 4,
    minGramsPerItem: 100,
    isPopular: true,
    isActive: true
  },
  {
    id: "box-royal-1000g",
    name: "Royal Emerald Box (1 kg)",
    urduName: "رائل ایمرلڈ بکس (۱ کلو)",
    capacityGrams: 1000,
    packagingFee: 100,
    badge: "Signature Royal",
    urduBadge: "شاہی شاہکار",
    description: "Our signature emerald green & gold foil luxury box. Features 4 to 6 compartments, gold inner tray, and royal ribbon seal.",
    urduDescription: "سویرا سویٹس کا دستخطی سبز اور سنہری لکژری بکس۔ چار سے چھ قسم کی مٹھائیوں کے لیے گولڈن اندرونی ٹرے اور ربن سیل۔",
    image: "/images/hero/all-sweets.jpg",
    dimensions: "24 x 20 x 5.5 cm",
    maxVarieties: 6,
    minGramsPerItem: 100,
    isPopular: true,
    isActive: true
  },
  {
    id: "box-family-2000g",
    name: "Executive Grand Feast Box (2 kg)",
    urduName: "ایگزیکٹو گرینڈ فیملی بکس (۲ کلو)",
    capacityGrams: 2000,
    packagingFee: 180,
    badge: "Family Celebration",
    urduBadge: "فیملی تقریبات",
    description: "Grand celebration rigid gift box crafted for large families, wedding gifts, and corporate events with up to 8 sweet selections.",
    urduDescription: "بڑی فیملیز، شادی بیاہ اور بڑی تقریبات کے لیے آٹھ مختلف مٹھائیوں کی گنجائش والا شاہی بکس۔",
    image: "/images/hero/bakery-sweets.jpg",
    dimensions: "32 x 26 x 6 cm",
    maxVarieties: 8,
    minGramsPerItem: 150,
    isPopular: false,
    isActive: true
  },
  {
    id: "box-velvet-1000g",
    name: "Shahi Velvet VIP Gift Box (1 kg)",
    urduName: "شاہی ویلوٹ وی آئی پی بکس (۱ کلو)",
    capacityGrams: 1000,
    packagingFee: 250,
    badge: "Luxury VIP Gift",
    urduBadge: "وی آئی پی تحفہ",
    description: "Ultra-luxury deep emerald velvet finish box with magnetic closure, custom gold seal, and personalized calligraphy greeting card.",
    urduDescription: "مخمل کی ملائم فنش اور میگنیٹک بندش والا الٹرا لکژری بکس۔ تحائف اور خاص مہمانوں کے لیے خصوصی گفٹ کارڈ کے ساتھ۔",
    image: "/images/categories/sweets.jpg",
    dimensions: "25 x 21 x 6 cm",
    maxVarieties: 6,
    minGramsPerItem: 100,
    isPopular: false,
    isActive: true
  }
];

export const GIFT_RIBBON_OPTIONS = [
  { id: "ribbon-gold", name: "Royal Gold Ribbon", urduName: "شاہی گولڈن ربن", fee: 0, color: "#D4AF37", colorHex: "#D4AF37" },
  { id: "ribbon-emerald", name: "Emerald Green Silk", urduName: "سبز ریشمی ربن", fee: 0, color: "#07643D", colorHex: "#07643D" },
  { id: "ribbon-crimson", name: "Festive Crimson Red", urduName: "سرخ فیسٹیو ربن", fee: 0, color: "#991B1B", colorHex: "#991B1B" },
  { id: "ribbon-none", name: "Classic (No Ribbon)", urduName: "سادہ (بغیر ربن)", fee: 0, color: "#E5E7EB", colorHex: "#E5E7EB" }
];

export const GIFT_OCCASION_TEMPLATES = [
  {
    id: "tmpl-mubarak",
    label: "Congratulations & Mubarakbaad",
    urduLabel: "مبارک باد",
    defaultMessage: "Dil ki gehraiyon se bohot bohot Mubarakbaad! Allah Ta'ala aapki khushiyon mein mazeed barkat farmaye. Ameen.",
    urduMessage: "دل کی گہرائیوں سے بہت بہت مبارک باد! اللہ تعالیٰ آپ کی خوشیوں میں مزید برکت فرمائے۔ آمین۔"
  },
  {
    id: "tmpl-wedding",
    label: "Wedding & Shadi Mubarak",
    urduLabel: "شادی مبارک",
    defaultMessage: "Shadi bohot bohot Mubarak! May your new journey be filled with sweetness, love, and joy.",
    urduMessage: "شادی بہت بہت مبارک! دعا ہے کہ آپ کا نیا سفر دائمی محبت اور خوشیوں سے بھرپور ہو۔"
  },
  {
    id: "tmpl-eid",
    label: "Eid Mubarak",
    urduLabel: "عید مبارک",
    defaultMessage: "Aapko aur aapki puri family ko Sawera Sweets ki taraf se Eid Mubarak! Har Khushi Ke Sath.",
    urduMessage: "آپ کو اور آپ کے اہل خانہ کو دل کی اتھاہ گہرائیوں سے عید مبارک! ہر خوشی کیساتھ۔"
  },
  {
    id: "tmpl-custom",
    label: "Custom Personal Message",
    urduLabel: "اپنی مرضی کا پیغام",
    defaultMessage: "",
    urduMessage: ""
  }
];
