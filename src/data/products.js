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
