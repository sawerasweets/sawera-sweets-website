// Sawera Sweets & Bakers - Product Catalog Architecture
// Handcrafted products with authentic recipes from Jhang since 1994.

export const PRODUCTS = [
  {
    id: "prd-special-roll-barfi",
    name: "Special Roll Barfi",
    urduName: "اسپیشل رول برفی",
    slug: "special-roll-barfi",
    category: "sweets",
    subCategory: "Barfi & Peda",
    description: "Prepared with 100% pure thick khoya, fragrant desi ghee, and aromatic green cardamom, expertly hand-rolled and generously coated with crunchy sliced almonds and rich roasted pistachios. A signature melt-in-the-mouth royal delicacy from Sawera Sweets & Bakers.",
    urduDescription: "سو فیصد خالص کڑھے ہوئے کھوئے اور سبز الائچی کی دلکش خوشبو سے تیار کردہ، پستے اور بادام کے لذیذ مغز میں لپٹی شاہی رول برفی۔ منہ میں گھل جانے والی مٹھاس اور سویرا سویٹس کا تیس سالہ بااعتماد روایتی ذائقہ۔",
    ingredients: "Pure Khoya (Milk Solids), Sugar, Desi Ghee, Green Cardamom, Premium Sliced Almonds, Roasted Pistachios",
    image: "/images/products/special-roll-barfi.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 65,
    badge: "Special Desi Ghee",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 16
  },
  {
    id: "prd-special-badam-barfi",
    name: "Special Badam Barfi",
    urduName: "اسپیشل بادام برفی",
    slug: "special-badam-barfi",
    category: "sweets",
    subCategory: "Barfi & Peda",
    description: "Crafted with pure slow-simmered buffalo milk khoya and desi ghee, lavishly loaded inside and out with hand-sliced crunchy almonds (badam) and roasted green pistachios. Traditional square-cut perfection celebrating 30+ years of Sawera Sweets heritage.",
    urduDescription: "تازہ کڑھے ہوئے خالص کھوئے اور دیسی گھی سے تیار کردہ روایتی مربع بادام برفی، جس کے ہر ٹکڑے کے اندر اور اوپر کٹے ہوئے بادام اور پستے کا وافر مغز شامل ہے۔ سویرا سویٹس جھنگ کا ایک خاص اور شاہی تحفہ۔",
    ingredients: "Pure Khoya (Milk Solids), Sugar, Desi Ghee, Green Cardamom, Premium California Almonds (Badam), Roasted Pistachios",
    image: "/images/products/special-badam-barfi.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 82,
    badge: "Pure Almond Delight",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-badam-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-badam-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-badam-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 21
  },
  {
    id: "prd-special-coconut-halwa",
    name: "Special Coconut Halwa",
    urduName: "اسپیشل کوکونٹ حلوہ (ناریل حلوہ)",
    slug: "special-coconut-halwa",
    category: "sweets",
    subCategory: "Traditional Halwa",
    description: "Prepared with freshly grated premium coconut, rich desi ghee, full-cream milk, and fragrant cardamom, garnished generously with roasted pistachios and crunchy almond slivers. A heavenly, aromatic warm delight perfect for special celebrations.",
    urduDescription: "تازہ پسے ہوئے ناریل، خالص دیسی گھی، بالائی والے دودھ اور سبز الائچی سے تیار کردہ دانے دار اسپیشل کوکونٹ حلوہ۔ بادام اور پستے کے لذیذ چھڑکاؤ کے ساتھ ہر خاص تقریب اور سردیوں کا شاہی تحفہ۔",
    ingredients: "Fresh Grated Coconut, Pure Desi Ghee, Milk, Sugar, Green Cardamom, Almonds (Badam), Roasted Pistachios",
    image: "/images/products/special-coconut-halwa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 58,
    badge: "Pure Desi Ghee & Coconut",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-coconut-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-coconut-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-coconut-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 19
  },
  {
    id: "prd-paltawa-patisa",
    name: "Paltawa Patisa (Flaky Desi Ghee Patisa)",
    urduName: "پلٹواں پتیسہ (خالص دیسی گھی)",
    slug: "paltawa-patisa",
    category: "sweets",
    subCategory: "Patisa & Sohan Halwa",
    description: "Traditional hand-pulled multi-layered flaky patisa prepared in pure desi ghee, golden roasted gram flour (besan), and aromatic cardamom. Each square features delicate melt-in-the-mouth crisp layers generously topped with sliced almonds and pistachios.",
    urduDescription: "خالص دیسی گھی اور بھنے ہوئے بیسن سے روایتی ہاتھ سے پلٹ کر تیار کردہ لچھے دار پتیسہ۔ باریک اور کرسپی تہوں میں بادام اور پستے کی وافر سجاوٹ، جو منہ میں جاتے ہی گھل جائے۔ سویرا سویٹس کی خاص پہچان۔",
    ingredients: "Pure Desi Ghee, Roasted Gram Flour (Besan), Fine Flour, Sugar, Green Cardamom, Premium Sliced Almonds, Pistachios",
    image: "/images/products/paltawa-patisa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 95,
    badge: "Hand-Folded Desi Ghee",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-patisa-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-patisa-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-patisa-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 28
  },
  {
    id: "prd-milky-patisa",
    name: "Special Milky Patisa",
    urduName: "اسپیشل ملکی پتیسہ (بادامی)",
    slug: "milky-patisa",
    category: "sweets",
    subCategory: "Patisa & Sohan Halwa",
    description: "Delightfully creamy and rich milk-based flaky patisa prepared with pure condensed milk khoya, desi ghee, and fine flour, generously studded with premium sliced almonds. It offers a velvety soft, melt-in-the-mouth milky sweetness loved by all ages.",
    urduDescription: "خالص بالائی والے دودھ کے کھوئے، دیسی گھی اور بادام کے لذیذ ٹکڑوں سے تیار کردہ نرم و ملائم ملکی پتیسہ۔ روایتی مٹھاس اور کریمی ذائقے کا ایک منفرد شاہکار، جو ہر عمر کے افراد کی اولین پسند ہے۔",
    ingredients: "Pure Milk Khoya, Desi Ghee, Sugar, Refined Flour, Green Cardamom, Premium California Almonds (Badam)",
    image: "/images/products/milky-patisa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 76,
    badge: "Rich Milk & Almonds",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-milky-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-milky-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-milky-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 24
  },
  {
    id: "prd-dilli-halwa",
    name: "Special Dilli Halwa (Sohan Tikki)",
    urduName: "اسپیشل دہلی حلوہ (سوھن ٹکی)",
    slug: "dilli-halwa",
    category: "sweets",
    subCategory: "Patisa & Sohan Halwa",
    description: "A timeless royal recipe made with sprouted wheat (samnak), slow-caramelized milk, pure desi ghee, and fragrant cardamom. Formed into thick traditional round discs (tikkis) and crowned with fresh coconut slivers and crunchy almonds. Rich, chewy, and irresistibly wholesome.",
    urduDescription: "انگوری (سمنک)، کڑھے ہوئے دودھ اور خالص دیسی گھی سے روایتی شاہی انداز میں تیار کردہ مشہور دہلی حلوہ ٹکی۔ تازہ گری (ناریل) اور کٹے بادام کے پروقار تاج کے ساتھ تیار، جو روایتی مٹھاس کا اعلیٰ ترین معیار پیش کرتا ہے۔",
    ingredients: "Sprouted Wheat Germ (Samnak/Angoori), Fresh Milk, Pure Desi Ghee, Sugar, Sliced Coconut (Gari), Premium Almonds, Cardamom",
    image: "/images/products/dilli-halwa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 88,
    badge: "Royal Desi Ghee Tradition",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-dilli-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-dilli-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-dilli-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 31
  },
  {
    id: "prd-dry-fruit-halwa",
    name: "Special Shahi Dry Fruit Halwa",
    urduName: "اسپیشل شاہی ڈرائی فروٹ حلوہ",
    slug: "dry-fruit-halwa",
    category: "sweets",
    subCategory: "Traditional Halwa",
    description: "An opulent royal delicacy slowly simmered in 100% pure desi ghee, golden suji, milk, and saffron cardamom essence. Lavishly loaded with whole premium cashews (kaju), California almonds, roasted walnuts (akhrot), green pistachios, and sweet golden raisins. The ultimate nutritious and energy-packed traditional treat.",
    urduDescription: "سو فیصد خالص دیسی گھی، سوجی اور دودھ سے تیار کردہ شاہی ڈرائی فروٹ حلوہ۔ کاجو، بادام، اخروٹ، پستے اور کشمش کے بھرپور اور وافر میوہ جات سے سجا مقوی اور لذیذ شاہکار۔ سردیوں اور پروقار دعوتوں کے لیے لاجواب سوغات۔",
    ingredients: "Pure Desi Ghee, Fine Semolina (Suji), Fresh Milk, Sugar, Whole Cashews (Kaju), California Almonds (Badam), Walnuts (Akhrot), Pistachios (Pista), Golden Raisins (Kishmish), Green Cardamom",
    image: "/images/products/dry-fruit-halwa.jpg",
    price: 1400,
    discountPrice: 1300,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 110,
    badge: "5 Dry Fruits Loaded",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-dryfruit-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 700,
        discountPrice: 650
      },
      {
        id: "var-dryfruit-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1400,
        discountPrice: 1300
      },
      {
        id: "var-dryfruit-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2800,
        discountPrice: 2600
      }
    ],
    rating: 5.0,
    reviewCount: 37
  },
  {
    id: "prd-special-sohan-halwa",
    name: "Special Desi Ghee Sohan Halwa",
    urduName: "اسپیشل دیسی گھی سوہن حلوہ",
    slug: "special-sohan-halwa",
    category: "sweets",
    subCategory: "Patisa & Sohan Halwa",
    description: "Authentic centuries-old heritage recipe prepared with sprouted wheat (samnak), slow-simmered rich buffalo milk, and 100% pure desi ghee. Glistening with aromatic ghee, grainy (danedar) texture, and lavishly garnished with crunchy toasted almonds. The undisputed pride of traditional Punjabi sweets.",
    urduDescription: "انگوری (سمنک گندم)، گھنٹوں کڑھے ہوئے دودھ اور سو فیصد خالص دیسی گھی سے تیار کردہ دانے دار روایتی سوہن حلوہ۔ دیسی گھی کی خوشبو، قدرتی کیریمل مٹھاس اور کٹے باداموں کی بھرپور سجاوٹ۔ سویرا سویٹس کا سب سے خاص اور تاریخی تحفہ۔",
    ingredients: "Sprouted Wheat (Samnak/Angoori), Fresh Buffalo Milk, Pure Desi Ghee, Sugar, Sliced California Almonds, Green Cardamom",
    image: "/images/products/special-sohan-halwa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 145,
    badge: "Pure Desi Ghee Danedar",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-sohan-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-sohan-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-sohan-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 42
  },
  {
    id: "prd-badami-halwa",
    name: "Special Desi Ghee Badami Halwa",
    urduName: "اسپیشل دیسی گھی بادامی حلوہ",
    slug: "badami-halwa",
    category: "sweets",
    subCategory: "Traditional Halwa",
    description: "Traditional grainy golden halwa prepared with pure country desi ghee, slow-roasted fine semolina (suji), and rich creamy milk. Lavishly adorned with toasted sliced California almonds and aromatic cardamom. A warm, rich, and soul-satisfying royal dessert.",
    urduDescription: "خالص دیسی گھی، سوجی کی سنہری بھنائی اور تازہ دودھ سے روایتی انداز میں تیار کردہ دانے دار بادامی حلوہ۔ کٹے ہوئے خستہ باداموں اور الائچی کے عطر سے سجا لاجواب تحفہ۔ منہ میں گھل جانے والا روایتی اور شاہی ذائقہ۔",
    ingredients: "Pure Desi Ghee, Fine Semolina (Suji), Fresh Milk, Sugar, California Sliced Almonds (Badam), Green Cardamom",
    image: "/images/products/badami-halwa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 98,
    badge: "Pure Desi Ghee & Badam",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-badamih-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-badamih-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-badamih-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 35
  },
  {
    id: "prd-shapper-pista-patisa",
    name: "Special Shapper Pista Patisa (Round Flaky Patisa)",
    urduName: "اسپیشل شاپر پستہ پتیسہ (گول لچھے دار)",
    slug: "shapper-pista-patisa",
    category: "sweets",
    subCategory: "Patisa & Sohan Halwa",
    description: "Delightful round discs of hand-spun lachhedar flaky patisa infused with natural pistachio flavor and cardamom, prepared in pure desi ghee. Each round cake features cotton-soft crisp threads that melt effortlessly on the tongue, crowned with crunchy slivered almonds and roasted pistachios.",
    urduDescription: "خالص دیسی گھی، پستے کی خوشبو اور لچھے دار روایتی کاریگری سے تیار کردہ گول شاپر پستہ پتیسہ۔ روئی کی طرح نرم، کرسپی اور منہ میں گھل جانے والی لذیذ تہیں، جن پر بادام اور پستے کی بھرپور سجاوٹ کی گئی ہے۔",
    ingredients: "Pure Desi Ghee, Roasted Gram Flour, Fine Flour, Sugar, Natural Pistachio Essence, Green Cardamom, Sliced Almonds, Pistachios",
    image: "/images/products/shapper-pista-patisa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 89,
    badge: "Pistachio Lachhadar",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-shapper-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-shapper-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-shapper-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 29
  },
  {
    id: "prd-shapper-milky-patisa",
    name: "Special Shapper Milky Patisa (Round White Lachha)",
    urduName: "اسپیشل شاپر ملکی پتیسہ (گول سفید لچھا)",
    slug: "shapper-milky-patisa",
    category: "sweets",
    subCategory: "Patisa & Sohan Halwa",
    description: "Crafted with creamy condensed milk khoya, pure desi ghee, and fine flour, skillfully hand-spun into thick round discs of delicate white lachhedar threads. Wonderfully soft, silky, and melt-in-the-mouth, lavishly topped with roasted almonds and crushed pistachios.",
    urduDescription: "خالص بالائی والے دودھ کے کھوئے اور دیسی گھی سے تیار کردہ سفید گول شاپر ملکی پتیسہ۔ روئی جیسے نرم و نازک لچھوں سے مزین، جس پر پستے اور بادام کا وافر چھڑکاؤ کیا گیا ہے۔ زبان پر رکھتے ہی گھل جانے والی لاجواب مٹھاس۔",
    ingredients: "Pure Milk Khoya, Desi Ghee, Fine Wheat Flour, Sugar, Green Cardamom, Premium Sliced Almonds, Crushed Pistachios",
    image: "/images/products/shapper-milky-patisa.jpg",
    price: 1300,
    discountPrice: 1200,
    unit: "1 kg",
    isFeatured: true,
    isBestSeller: true,
    isSpecialOffer: true,
    salesCount: 92,
    badge: "Creamy White Lachha",
    stockStatus: "in_stock",
    inStock: true,
    stocks: {
      "shop-1": 50
    },
    variations: [
      {
        id: "var-shapperm-500g",
        label: "500 Grams (آدھا کلو)",
        urduLabel: "500 گرام (آدھا کلو)",
        weight: "500g",
        price: 650,
        discountPrice: 600
      },
      {
        id: "var-shapperm-1kg",
        label: "1 Kilogram (ایک کلو)",
        urduLabel: "1 کلوگرام (ایک کلو)",
        weight: "1kg",
        price: 1300,
        discountPrice: 1200
      },
      {
        id: "var-shapperm-2kg",
        label: "2 Kilogram Gift Box (دو کلو تحفہ بکس)",
        urduLabel: "2 کلوگرام (دو کلو تحفہ بکس)",
        weight: "2kg",
        price: 2600,
        discountPrice: 2400
      }
    ],
    rating: 5.0,
    reviewCount: 33
  }
];

export const getProductById = (id) => PRODUCTS.find(p => p.id === id);

export const getProductsByCategory = (categorySlug) => {
  if (!categorySlug || categorySlug === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category && p.category.toLowerCase() === categorySlug.toLowerCase());
};

export const getFeaturedProducts = () => PRODUCTS.filter(p => p.isFeatured);
export const getBestSellers = () => PRODUCTS.filter(p => p.isBestSeller);
export const getSpecialOffers = () => PRODUCTS.filter(p => p.isSpecialOffer);
