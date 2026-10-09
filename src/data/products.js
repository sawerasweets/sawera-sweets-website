// Sawera Sweets & Bakers - Product Catalog Architecture
// Clean slate: Demo products removed so store owner (Muhammad Akash) can add real products.

export const PRODUCTS = [];

export const getProductById = (id) => PRODUCTS.find(p => p.id === id);

export const getProductsByCategory = (categorySlug) => {
  if (!categorySlug || categorySlug === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category && p.category.toLowerCase() === categorySlug.toLowerCase());
};

export const getFeaturedProducts = () => PRODUCTS.filter(p => p.isFeatured);
export const getBestSellers = () => PRODUCTS.filter(p => p.isBestSeller);
export const getSpecialOffers = () => PRODUCTS.filter(p => p.isSpecialOffer);
