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
