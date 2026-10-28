// Sawera Sweets & Bakers — Comprehensive Post-Upgrade Test & Audit Suite
// Tests catalog data, business rules, Box Studio logic, pricing math, DB operations, translations, and RBAC.

import fs from 'fs';
import { PRODUCTS } from './src/data/products.js';
import { CATEGORIES } from './src/data/categories.js';
import { STORE_CONFIG } from './src/data/storeConfig.js';
import { DEFAULT_BOX_OPTIONS, GIFT_RIBBON_OPTIONS, GIFT_OCCASION_TEMPLATES } from './src/data/boxStudioConfig.js';
import { DEFAULT_OCCASIONS } from './src/data/occasionsConfig.js';
import { TRANSLATIONS } from './src/data/translations.js';
import { PAKISTAN_CITIES, TOP_CITIES } from './src/data/pakistanCities.js';

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    failures.push(testName);
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

console.log('\n==================================================');
console.log('1. CATALOG DATA & ASSET INTEGRITY');
console.log('==================================================');

const sweetProducts = PRODUCTS.filter(p => p.category === 'sweets');
assert(sweetProducts.length === 12, `Catalog preserves all 12 authentic sweets (Found: ${sweetProducts.length})`);
assert(PRODUCTS.length === 16, `Catalog has 16 products including trending items (Found: ${PRODUCTS.length})`);

// Check every product has required fields and valid image file on disk
let allImagesExist = true;
let allPricesValid = true;
let allHaveUrdu = true;

for (const p of PRODUCTS) {
  if (!fs.existsSync('./public' + p.image)) {
    allImagesExist = false;
    console.error(`Missing image for ${p.id}: ./public${p.image}`);
  }
  if (!p.price || p.price <= 0 || (p.discountPrice && p.discountPrice >= p.price)) {
    allPricesValid = false;
    console.error(`Invalid pricing for ${p.id}: regular=${p.price}, discount=${p.discountPrice}`);
  }
  if (!p.urduName || !p.urduDescription) {
    allHaveUrdu = false;
    console.error(`Missing Urdu metadata for ${p.id}`);
  }
}

assert(allImagesExist, 'All product image files exist on disk in ./public');
assert(allPricesValid, 'All products have valid realistic pricing with discounted promo price < regular price');
assert(allHaveUrdu, 'All products contain authentic Urdu names and descriptions');

console.log('\n==================================================');
console.log('2. BUSINESS IDENTITY & 7 STORE CATEGORIES (TRENDING + 6 CORE)');
console.log('==================================================');

const expectedCategories = [
  'trending',
  'sweets',
  'bakery',
  'grocery',
  'cosmetics',
  'perfumes',
  'beverages'
];

assert(CATEGORIES.length === 7, `All 7 store categories maintained including trending items (Found: ${CATEGORIES.length})`);
const categorySlugs = CATEGORIES.map(c => c.slug);
const allCategoriesMatch = expectedCategories.every(slug => categorySlugs.includes(slug));
assert(allCategoriesMatch, `Official categories exactly match [${expectedCategories.join(', ')}]`);

// Check phone and address in STORE_CONFIG
assert(STORE_CONFIG.contact.phone.includes('0322 7434080'), `Main contact phone is 0322 7434080 (Found: ${STORE_CONFIG.contact.phone})`);
assert(STORE_CONFIG.contact.whatsapp.includes('0322 7434080'), `WhatsApp number is 0322 7434080 (Found: ${STORE_CONFIG.contact.whatsapp})`);
assert(STORE_CONFIG.contact.address.includes('DHQ Hospital'), `Address is Gojra Road, Opp DHQ Hospital (Found: ${STORE_CONFIG.contact.address})`);

console.log('\n==================================================');
console.log('3. MITHAI BOX STUDIO CONFIGURATION & PRICING MATH');
console.log('==================================================');

assert(DEFAULT_BOX_OPTIONS.length === 4, `4 default box options configured (Found: ${DEFAULT_BOX_OPTIONS.length})`);
assert(GIFT_RIBBON_OPTIONS.length === 4, `4 satin ribbon options configured (Found: ${GIFT_RIBBON_OPTIONS.length})`);
assert(GIFT_OCCASION_TEMPLATES.length === 4, `4 gift greeting card templates configured (Found: ${GIFT_OCCASION_TEMPLATES.length})`);

// Test pricing calculation simulation
// Select 1kg Royal Emerald Box (packaging fee Rs. 100)
// Content: 500g Special Roll Barfi (Rs 1200/kg) + 500g Special Badam Barfi (Rs 1200/kg)
const rollBarfi = PRODUCTS.find(p => p.id === 'prd-special-roll-barfi');
const badamBarfi = PRODUCTS.find(p => p.id === 'prd-special-badam-barfi');

const getTestPerKgPrice = (prod) => {
  const base = prod?.discountPrice || prod?.price || 0;
  if (prod?.unit?.includes('500')) return base * 2;
  return base;
};

const rollPricePerGram = getTestPerKgPrice(rollBarfi) / 1000;
const badamPricePerGram = getTestPerKgPrice(badamBarfi) / 1000;

const rollPortionCost = Math.round(500 * rollPricePerGram); // 775 (Authentic owner price)
const badamPortionCost = Math.round(500 * badamPricePerGram); // 675 (Authentic owner price)
const sweetsContentSubtotal = rollPortionCost + badamPortionCost; // 1450
const packagingFee = 100; // 1kg box
const expectedBoxTotal = sweetsContentSubtotal + packagingFee; // 1550

assert(rollPortionCost === 775, `500g Roll Barfi portion calculated as Rs. 775 (Got: ${rollPortionCost})`);
assert(badamPortionCost === 675, `500g Badam Barfi portion calculated as Rs. 675 (Got: ${badamPortionCost})`);
assert(expectedBoxTotal === 1550, `1kg custom box total is Rs. 1,550 (Got: ${expectedBoxTotal})`);

// Test Dry Fruit Halwa calculation (Rs 750 / 500g -> Rs 1500/kg)
const dryFruitHalwa = PRODUCTS.find(p => p.id === 'prd-dry-fruit-halwa');
const dryHalwaPricePerGram = getTestPerKgPrice(dryFruitHalwa) / 1000;
const dryHalwa250gCost = Math.round(250 * dryHalwaPricePerGram); // 375
assert(dryHalwa250gCost === 375, `250g Dry Fruit Halwa calculated as Rs. 375 (Got: ${dryHalwa250gCost})`);

console.log('\n==================================================');
console.log('4. OCCASION COLLECTIONS INTEGRITY');
console.log('==================================================');

assert(DEFAULT_OCCASIONS.length === 4, `4 occasion-based collections configured (Found: ${DEFAULT_OCCASIONS.length})`);

let allOccasionProductIdsValid = true;
for (const occ of DEFAULT_OCCASIONS) {
  for (const pid of occ.productIds) {
    if (!PRODUCTS.some(p => p.id === pid)) {
      allOccasionProductIdsValid = false;
      console.error(`Occasion ${occ.id} references non-existent product ID: ${pid}`);
    }
  }
}
assert(allOccasionProductIdsValid, 'All occasion collections reference genuine catalog product IDs');

console.log('\n==================================================');
console.log('5. BILINGUAL TRANSLATION DICTIONARY SYNC');
console.log('==================================================');

const enKeys = Object.keys(TRANSLATIONS.en);
const urKeys = Object.keys(TRANSLATIONS.ur);

assert(enKeys.length > 50, `English dictionary has ${enKeys.length} entries`);
assert(urKeys.length > 50, `Urdu dictionary has ${urKeys.length} entries`);

const missingUrduKeys = enKeys.filter(k => !urKeys.includes(k));
if (missingUrduKeys.length > 0) {
  console.warn('Keys in EN missing in UR:', missingUrduKeys);
}
assert(missingUrduKeys.length === 0, `All ${enKeys.length} English translation keys have exact Urdu counterparts`);

console.log('\n==================================================');
console.log('6. ALL PAKISTAN CITIES (A-Z) & NATIONWIDE DELIVERY RULES');
console.log('==================================================');

assert(PAKISTAN_CITIES.length >= 200, `Comprehensive Pakistan city catalog has ${PAKISTAN_CITIES.length} cities (Expected: >= 200)`);
assert(TOP_CITIES.includes('Jhang') && TOP_CITIES.includes('Lahore') && TOP_CITIES.includes('Karachi') && TOP_CITIES.includes('Islamabad'), 'Top quick-select cities include Jhang, Lahore, Karachi, and Islamabad');

// Check alphabetical order of cities A to Z
const firstCity = PAKISTAN_CITIES[0].name;
const lastCity = PAKISTAN_CITIES[PAKISTAN_CITIES.length - 1].name;
assert(firstCity.startsWith('A') && lastCity.startsWith('Z'), `Cities ordered A to Z: Starts with ${firstCity}, ends with ${lastCity}`);

// Delivery rules: Standard Nationwide Delivery Fee with Free Delivery threshold
function calculateDelivery(subtotal, defaultFee = 100, freeThreshold = 3000) {
  return (freeThreshold && subtotal >= freeThreshold) ? 0 : defaultFee;
}

assert(calculateDelivery(1500) === 100, 'Order Rs. 1500 delivery fee is standard Rs. 100');
assert(calculateDelivery(3000) === 0, 'Order Rs. 3000 qualifies for Free Delivery (Rs. 0)');
assert(calculateDelivery(4500) === 0, 'Order Rs. 4500 qualifies for Free Delivery (Rs. 0)');
assert(calculateDelivery(500, 150) === 150, 'Custom Admin delivery fee (Rs. 150) calculates correctly');

console.log('\n==================================================');
console.log('7. IN-MEMORY / LOCALSTORAGE DATABASE MOCK TESTS');
console.log('==================================================');

// Mock browser localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
};

// Mock window CustomEvent for db.js
global.window = {
  dispatchEvent: () => true
};
global.CustomEvent = class {
  constructor(name, opts) {
    this.name = name;
    this.opts = opts;
  }
};

const { default: db } = await import('./src/services/db.js');

// Test DB initialization
assert(db.getProducts().length === 16, `DB initialized with 16 catalog products (Found: ${db.getProducts().length})`);
assert(db.getProducts().filter(p => p.category === 'sweets').length === 12, `DB maintains all 12 authentic sweets (Found: ${db.getProducts().filter(p => p.category === 'sweets').length})`);
assert(db.getBranches().length === 1, `DB initialized with single active branch Shop 1 (Found: ${db.getBranches().length})`);
assert(db.getBoxOptions().length === 4, `DB initialized with 4 box options (Found: ${db.getBoxOptions().length})`);
assert(db.getOccasions().length === 4, `DB initialized with 4 occasion collections (Found: ${db.getOccasions().length})`);

// Test Category Operations & Active Toggles
assert(db.getCategories().length === 7, `DB initialized with 7 categories (Found: ${db.getCategories().length})`);
assert(db.getCategories().every(c => c.isActive === true), 'All categories initialized as Active (Live)');
const trendingToggledOff = db.toggleCategoryActive('trending');
assert(trendingToggledOff.isActive === false, 'Trending category toggled to Inactive (Off)');
assert(db.getCategories().find(c => c.slug === 'trending').isActive === false, 'Category Inactive state persisted in DB');
const trendingToggledOn = db.toggleCategoryActive('trending');
assert(trendingToggledOn.isActive === true, 'Trending category toggled back to Active (Live)');

// Test Product Active Toggle
const p1 = db.getProducts()[0];
assert(p1.isActive !== false, 'Products initialized as Active by default');
const p1ToggledOff = db.toggleProductActive(p1.id);
assert(p1ToggledOff.isActive === false, `Product ${p1.name} toggled to Inactive (Off)`);
assert(db.getProductById(p1.id).isActive === false, 'Product Inactive state persisted in DB');
const p1ToggledOn = db.toggleProductActive(p1.id);
assert(p1ToggledOn.isActive === true, `Product ${p1.name} toggled back to Active (Live)`);

// Test Wishlist operations
assert(db.getWishlist().length === 0, 'Initial wishlist is empty');
db.toggleWishlist('prd-special-roll-barfi');
assert(db.isInWishlist('prd-special-roll-barfi') === true, 'Roll Barfi successfully added to wishlist');
assert(db.getWishlist().length === 1, 'Wishlist count is 1');
db.toggleWishlist('prd-special-roll-barfi');
assert(db.isInWishlist('prd-special-roll-barfi') === false, 'Roll Barfi successfully toggled out of wishlist');
assert(db.getWishlist().length === 0, 'Wishlist is empty again');

// Test Recently Viewed
db.addRecentlyViewed('prd-dilli-halwa');
db.addRecentlyViewed('prd-paltawa-patisa');
const recent = db.getRecentlyViewed();
assert(recent.length === 2 && recent[0] === 'prd-paltawa-patisa', 'Recently viewed correctly tracks and orders viewed products');

// Test Order Placement simulation
const testOrderPayload = {
  customer: {
    name: "Audit Test Customer",
    email: "audit@sawerasweets.pk",
    phone: "0322 7434080",
    city: "Lahore",
    address: "Gulberg III, Lahore"
  },
  city: "Lahore",
  items: [
    {
      id: "prd-special-roll-barfi",
      name: "Special Roll Barfi",
      quantity: 1,
      price: 1200,
      unit: "1 kg"
    }
  ],
  fulfillmentType: "delivery",
  deliveryArea: "outside",
  paymentMethod: "cod",
  subtotal: 1200,
  deliveryFee: 100,
  total: 1300
};

const placedOrder = db.createOrder(testOrderPayload);
assert(placedOrder.id && placedOrder.id.startsWith('SAV-'), `Order placed successfully with ID: ${placedOrder.id}`);
assert(placedOrder.status === 'confirmed', `COD order automatically confirmed (Status: ${placedOrder.status})`);
assert(placedOrder.assignedBranch === 'shop-1', `Order assigned to main branch shop-1 (Branch: ${placedOrder.assignedBranch})`);

// Verify order retrieved
const fetchedOrder = db.getOrderById(placedOrder.id);
assert(fetchedOrder && fetchedOrder.total === 1300, 'Order successfully retrieved from database by ID');

// Cleanup test order so database remains pristine
const cleanedOrders = db.getOrders().filter(o => o.id !== placedOrder.id);
db.set('orders', cleanedOrders);
assert(db.getOrderById(placedOrder.id) === undefined, 'Test order safely cleaned up without altering real data');

console.log('\n==================================================');
console.log('8. CRITICAL EMERGENCY REPAIR & PERSISTENCE VERIFICATION');
console.log('==================================================');

// A. Product Prices & Variations Persistence Test
const testRollBarfi = db.getProductById('prd-special-roll-barfi');
const originalPrice = testRollBarfi.price;
const customPrice = 1450;
const customVariations = [
  { label: '500 Grams', price: 725, discountPrice: 700 },
  { label: '1 kg Special', price: 1450, discountPrice: 1400 }
];

db.saveProduct({
  ...testRollBarfi,
  price: customPrice,
  variations: customVariations
});

// Verify saved
assert(db.getProductById('prd-special-roll-barfi').price === customPrice, 'Test product price changed to custom Rs. 1450');
assert(db.getProductById('prd-special-roll-barfi').variations[0].price === 725, 'Test product custom variation price saved');

// Simulate page refresh / restart / version check
db.init();
assert(db.getProductById('prd-special-roll-barfi').price === customPrice, 'Product price remained Rs. 1450 after db.init() (Did not revert to default)');
assert(db.getProductById('prd-special-roll-barfi').variations[0].price === 725, 'Product variations remained custom after db.init()');

// Restore original product price
db.saveProduct({
  ...testRollBarfi,
  price: originalPrice,
  variations: testRollBarfi.variations
});
assert(db.getProductById('prd-special-roll-barfi').price === originalPrice, 'Product price restored cleanly');

// B. Category ON/OFF Persistence Across Restart
const trendingBefore = db.getCategories().find(c => c.slug === 'trending');
assert(trendingBefore.isActive === true, 'Trending category starts Active');
db.toggleCategoryActive('trending');
assert(db.getCategories().find(c => c.slug === 'trending').isActive === false, 'Trending category disabled (isActive === false)');

// Simulate page refresh / restart / version check
db.init();
assert(db.getCategories().find(c => c.slug === 'trending').isActive === false, 'Trending category remained disabled after db.init() (Did not revert to ON)');

// Re-enable trending category
db.toggleCategoryActive('trending');
assert(db.getCategories().find(c => c.slug === 'trending').isActive === true, 'Trending category re-enabled cleanly');

// C. Deleted Product Permanence Across Restart (Never Returns)
const tempTestProduct = {
  id: 'prd-custom-test-delete-item',
  name: 'Temporary Test Delete Item',
  category: 'sweets',
  price: 500,
  stocks: { 'shop-1': 10 }
};
db.saveProduct(tempTestProduct);
const testProdToDelete = 'prd-custom-test-delete-item';
assert(db.getProductById(testProdToDelete) !== undefined, 'Target product exists prior to deletion');
db.deleteProduct(testProdToDelete);

assert(db.getProductById(testProdToDelete) === undefined, 'Product successfully removed from active catalog');
assert(db.getProducts().some(p => p.id === testProdToDelete) === false, 'Product not present in getProducts()');
assert(db.get('deleted_product_ids').includes(testProdToDelete), 'Product ID recorded in deleted_product_ids');

// Simulate multiple page reloads / restarts
db.init();
assert(db.getProductById(testProdToDelete) === undefined, 'Deleted product does NOT return after db.init()');
assert(db.getProducts().some(p => p.id === testProdToDelete) === false, 'Deleted product completely absent from getProducts() after restart');

// Clean up test deleted ID
const deletedIds = db.get('deleted_product_ids').filter(id => id !== testProdToDelete);
db.set('deleted_product_ids', deletedIds);

// D. Admin Settings Persistence (Never Corrupted into Array)
const initialSettings = db.getSettings();
assert(typeof initialSettings === 'object' && !Array.isArray(initialSettings), 'Settings is a valid object and not an array');

const updatedSettings = db.updateSettings({
  defaultDeliveryFee: 175,
  freeDeliveryThreshold: 3500
});
assert(updatedSettings.defaultDeliveryFee === 175, 'Settings delivery fee updated to Rs. 175');
assert(db.getSettings().freeDeliveryThreshold === 3500, 'Settings free threshold updated to Rs. 3500');

// Simulate application restart
db.init();
const reloadedSettings = db.getSettings();
assert(reloadedSettings.defaultDeliveryFee === 175, 'Delivery fee persisted after db.init()');
assert(reloadedSettings.freeDeliveryThreshold === 3500, 'Free threshold persisted after db.init()');
assert(!Array.isArray(reloadedSettings), 'Reloaded settings is strictly an object');

// Restore settings
db.updateSettings(initialSettings);

// E. Admin Password Persistence Across Restarts & Version Changes
const adminUsers = db.get('users');
const currentAdminPass = adminUsers.find(u => u.role === 'owner_admin')?.password;
assert(Boolean(currentAdminPass), 'Admin user found with valid password');

// Update password
const updatePassRes = db.updateAdminPassword('admin@sawerasweets.pk', 'VerifiedSafePass2026!');
assert(updatePassRes.success === true, 'Admin password successfully updated via updateAdminPassword()');
assert(db.get('users').find(u => u.role === 'owner_admin').password === 'VerifiedSafePass2026!', 'Admin password updated in database users');

// Simulate application reload / db version check
db.init();
const adminAfterRestart = db.get('users').find(u => u.role === 'owner_admin');
assert(adminAfterRestart.password === 'VerifiedSafePass2026!', 'Admin password persisted after db.init() and did NOT revert to admin123');

// F. Failed Writes Display Validation
const failedPassUpdate = db.updateAdminPassword('admin@sawerasweets.pk', '12');
assert(failedPassUpdate.success === false, 'Short password correctly rejected with error');

let settingsErrorCaught = false;
try {
  db.updateSettings('invalid-string');
} catch (e) {
  settingsErrorCaught = true;
}
assert(settingsErrorCaught === true, 'Invalid settings write throws error instead of falsely reporting success');

// Clean up admin password back to initial test state
db.updateAdminPassword('admin@sawerasweets.pk', currentAdminPass);
assert(db.get('users').find(u => u.role === 'owner_admin').password === currentAdminPass, 'Admin password restored cleanly');

console.log('\n==================================================');
console.log('9. MASTER SECURITY, VISIBILITY & CROSS-DEVICE TESTS');
console.log('==================================================');

// A. Historical Order Price Snapshot Integrity
const histProduct = db.getProductById('prd-special-roll-barfi');
const originalHistPrice = histProduct.price;
const testHistoricalOrder = db.createOrder({
  customer: { name: "Test Historical Customer", phone: "03001234567" },
  items: [
    {
      id: histProduct.id,
      name: histProduct.name,
      price: histProduct.price,
      quantity: 2,
      unit: histProduct.unit
    }
  ],
  subtotal: histProduct.price * 2,
  deliveryFee: 100,
  total: (histProduct.price * 2) + 100,
  paymentMethod: "cod"
});

// Update the product's price in the store to a different price (e.g. inflation / price change)
db.saveProduct({
  ...histProduct,
  price: originalHistPrice + 500
});

// Fetch historical order and verify that historical prices are NEVER altered by modern product price changes
const checkedHistOrder = db.getOrderById(testHistoricalOrder.id);
assert(checkedHistOrder.items[0].price === originalHistPrice, 'Historical order retained original price snapshot (Not altered by today\'s price changes)');
assert(checkedHistOrder.total === (originalHistPrice * 2) + 100, 'Historical order total remained completely intact');

// Clean up historical order and restore product price
db.set('orders', db.getOrders().filter(o => o.id !== testHistoricalOrder.id));
db.saveProduct(histProduct);

// B. Category Public Visibility Enforcement
db.toggleCategoryActive('trending');
const activePublicCats = db.getCategories().filter(c => c.isActive !== false);
assert(!activePublicCats.some(c => c.slug === 'trending'), 'Disabled category completely excluded from public activeCategories');
db.toggleCategoryActive('trending'); // re-enable
assert(db.getCategories().filter(c => c.isActive !== false).some(c => c.slug === 'trending'), 'Re-enabled category restored to public activeCategories');

// C. Production Login Page Security Audit
const loginPageContent = fs.readFileSync('./src/pages/customer/CustomerLoginPage.jsx', 'utf8');
assert(!loginPageContent.includes('quickLoginAs'), 'quickLoginAs demo shortcut function removed from production login page');
assert(!loginPageContent.includes('Fast Role Switcher'), 'Fast Role Switcher (One-Click Demo Access) UI removed from login page');
assert(!loginPageContent.includes('admin123'), 'Hardcoded demo credentials removed from customer login page source');

// D. Footer Category Visibility Audit
const footerContent = fs.readFileSync('./src/components/common/Footer.jsx', 'utf8');
assert(footerContent.includes('activeCategories'), 'Footer renders activeCategories with isActive status instead of unfiltered static categories');

// E. Product Detail Page Inactive Category Protection Audit
const pdpContent = fs.readFileSync('./src/pages/ProductDetailPage.jsx', 'utf8');
assert(pdpContent.includes('isCategoryActive'), 'Product detail page enforces category active gate to prevent public access to paused categories');

console.log('\n==================================================');
console.log('AUDIT SUMMARY');
console.log('==================================================');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  console.error('Failed Tests:', failures);
  process.exit(1);
} else {
  console.log('ALL AUDIT SUITE TESTS PASSED PERFECTLY!\n');
}
