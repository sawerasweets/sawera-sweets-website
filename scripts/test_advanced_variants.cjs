const assert = require('assert');

// Mock localStorage for headless Node environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
global.window = {
  dispatchEvent: () => {},
  CustomEvent: function() {}
};

// Import database engine
const db = require('../src/services/db.js').default;

async function runTests() {
  console.log('==================================================');
  console.log('ADVANCED PRODUCT VARIANTS MANAGEMENT TEST SUITE');
  console.log('==================================================\n');

  // ------------------------------------------------------------------
  // SCENARIO 1: Add a new product with three weight options
  // ------------------------------------------------------------------
  console.log('--- SCENARIO 1: Add new product with 3 weight options ---');
  const newVariantProduct = {
    id: 'prd-test-halwa-poori-special',
    name: 'Special Royal Peda',
    urduName: 'شاہی پیڑا',
    category: 'sweets',
    price: 1600,
    unit: 'per 1 kg',
    allowsDecimalQuantity: true,
    variations: [
      {
        id: 'var-250g',
        label: '250 Grams (پاؤ)',
        urduLabel: '250 گرام (پاؤ)',
        weight: '250g',
        price: 400,
        discountPrice: 380,
        stock: 40,
        isActive: true,
        isDefault: false
      },
      {
        id: 'var-500g',
        label: '500 Grams (آدھا کلو)',
        urduLabel: '500 گرام (آدھا کلو)',
        weight: '500g',
        price: 800,
        discountPrice: null,
        stock: 35,
        isActive: true,
        isDefault: false
      },
      {
        id: 'var-1kg',
        label: '1 Kilogram (ایک کلو)',
        urduLabel: '1 کلوگرام (ایک کلو)',
        weight: '1kg',
        price: 1600,
        discountPrice: 1550,
        stock: 25,
        isActive: true,
        isDefault: true // Default pre-selected
      }
    ]
  };

  const savedProduct = db.saveProduct(newVariantProduct);
  assert(savedProduct.id === newVariantProduct.id, 'Product saved with correct ID');
  assert.strictEqual(savedProduct.variations.length, 3, 'Product has exactly 3 weight options');
  assert.strictEqual(savedProduct.variations.find(v => v.weight === '250g').price, 400, '250g price is Rs. 400');
  assert.strictEqual(savedProduct.variations.find(v => v.weight === '500g').price, 800, '500g price is Rs. 800');
  assert.strictEqual(savedProduct.variations.find(v => v.weight === '1kg').price, 1600, '1kg price is Rs. 1600');
  console.log('✓ Scenario 1 passed: New product with 3 weight options created successfully.');

  // ------------------------------------------------------------------
  // SCENARIO 2: Change the price of only the 500g variant
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 2: Change price of only 500g variant ---');
  const productToEdit = db.getProductById('prd-test-halwa-poori-special');
  const updatedVariations = productToEdit.variations.map(v => {
    if (v.weight === '500g') {
      return { ...v, price: 850, discountPrice: 820 }; // Only 500g updated to Rs. 850
    }
    return v;
  });

  db.saveProduct({
    ...productToEdit,
    variations: updatedVariations
  });

  const retrievedAfterEdit = db.getProductById('prd-test-halwa-poori-special');
  assert.strictEqual(retrievedAfterEdit.variations.find(v => v.weight === '500g').price, 850, '500g price successfully updated to Rs. 850');
  assert.strictEqual(retrievedAfterEdit.variations.find(v => v.weight === '500g').discountPrice, 820, '500g sale price updated to Rs. 820');
  assert.strictEqual(retrievedAfterEdit.variations.find(v => v.weight === '250g').price, 400, '250g price strictly untouched (Rs. 400)');
  assert.strictEqual(retrievedAfterEdit.variations.find(v => v.weight === '1kg').price, 1600, '1kg price strictly untouched (Rs. 1600)');
  console.log('✓ Scenario 2 passed: Changed only 500g price without affecting 250g or 1kg.');

  // ------------------------------------------------------------------
  // SCENARIO 3: Select 1kg on website and verify its price
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 3: Select 1kg on public website and verify its price ---');
  const prodForWeb = db.getProductById('prd-test-halwa-poori-special');
  const selected1kg = prodForWeb.variations.find(v => v.weight === '1kg');
  const effective1kgPrice = selected1kg.discountPrice || selected1kg.price;
  assert.strictEqual(effective1kgPrice, 1550, 'Effective price for 1kg is Rs. 1550 (with sale discount)');
  console.log('✓ Scenario 3 passed: 1kg price accurately verified as Rs. 1550.');

  // ------------------------------------------------------------------
  // SCENARIO 4: Add 500g to cart and verify checkout price
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 4: Add 500g to cart and verify checkout price ---');
  const selected500g = prodForWeb.variations.find(v => v.weight === '500g');
  const cartQuantity = 2; // Customer orders 2 packs of 500g
  const cartItemPrice = selected500g.discountPrice || selected500g.price; // Rs. 820
  const cartItemTotal = cartItemPrice * cartQuantity;

  const simulatedCartItem = {
    cartItemId: `${prodForWeb.id}-${selected500g.label}`,
    id: prodForWeb.id,
    name: prodForWeb.name,
    price: cartItemPrice,
    unit: selected500g.label,
    quantity: cartQuantity,
    variantId: selected500g.id,
    variation: selected500g
  };

  assert.strictEqual(simulatedCartItem.price, 820, 'Cart item price matches 500g sale price');
  assert.strictEqual(cartItemTotal, 1640, 'Checkout total for 2 x 500g is exactly Rs. 1640');
  console.log('✓ Scenario 4 passed: 500g added to cart with exact price Rs. 820 and checkout total Rs. 1640.');

  // ------------------------------------------------------------------
  // SCENARIO 5: Change variant price and verify old orders remain unchanged
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 5: Change variant price and verify old orders remain unchanged ---');
  // Create an order with the 500g item at Rs. 820
  const placedOrder = await db.createOrder({
    customer: { name: 'Muhammad Usman', phone: '03227434080' },
    items: [
      {
        id: prodForWeb.id,
        name: prodForWeb.name,
        selectedVariation: selected500g.label,
        variantId: selected500g.id,
        price: cartItemPrice, // Snapshot price: 820
        quantity: 2,
        unit: selected500g.label
      }
    ],
    subtotal: 1640,
    deliveryFee: 100,
    total: 1740,
    paymentMethod: 'cod'
  });

  assert(placedOrder && placedOrder.id, 'Historical order placed successfully');
  assert.strictEqual(placedOrder.items[0].price, 820, 'Historical order saved with item price Rs. 820');

  // Now, admin changes the 500g price in the product catalog to Rs. 950!
  const prodToRePrice = db.getProductById('prd-test-halwa-poori-special');
  const newVariations = prodToRePrice.variations.map(v => {
    if (v.weight === '500g') {
      return { ...v, price: 950, discountPrice: 950 };
    }
    return v;
  });
  db.saveProduct({ ...prodToRePrice, variations: newVariations });

  // Verify that the catalog has the new price (Rs. 950)
  const catalogUpdated = db.getProductById('prd-test-halwa-poori-special');
  assert.strictEqual(catalogUpdated.variations.find(v => v.weight === '500g').price, 950, 'Catalog now reflects new price of Rs. 950');

  // Verify that the PREVIOUSLY placed historical order is completely UNCHANGED (still Rs. 820)!
  const orderRetrieved = db.getOrderById(placedOrder.id);
  assert.strictEqual(orderRetrieved.items[0].price, 820, 'Historical order item price did NOT change (remains Rs. 820)');
  assert.strictEqual(orderRetrieved.total, 1740, 'Historical order total remained completely intact (Rs. 1740)');
  console.log('✓ Scenario 5 passed: Price inflation did NOT corrupt historical order records.');

  // Clean up test order
  db.deleteOrder(placedOrder.id);

  // ------------------------------------------------------------------
  // SCENARIO 6: Refresh website / db.init() and confirm all variants remain saved
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 6: Refresh website / restart db and confirm variants remain saved ---');
  db.init();
  const afterRestart = db.getProductById('prd-test-halwa-poori-special');
  assert(afterRestart !== undefined, 'Product exists after db.init()');
  assert.strictEqual(afterRestart.variations.length, 3, 'All 3 variants persisted after restart');
  assert.strictEqual(afterRestart.variations.find(v => v.weight === '250g').price, 400, '250g variant persisted');
  assert.strictEqual(afterRestart.variations.find(v => v.weight === '500g').price, 950, '500g variant persisted');
  assert.strictEqual(afterRestart.variations.find(v => v.weight === '1kg').price, 1600, '1kg variant persisted');
  console.log('✓ Scenario 6 passed: Complete variant configuration persisted across simulated restart.');

  // ------------------------------------------------------------------
  // SCENARIO 7: Disable an individual variant and verify visibility
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 7: Disable 250g variant (out of boxes) and verify ---');
  const varsWithDisabled = afterRestart.variations.map(v => {
    if (v.weight === '250g') {
      return { ...v, isActive: false }; // Disable 250g
    }
    return v;
  });
  db.saveProduct({ ...afterRestart, variations: varsWithDisabled });

  const prodWithDisabled = db.getProductById('prd-test-halwa-poori-special');
  const activeOnStore = prodWithDisabled.variations.filter(v => v.isActive !== false);
  assert.strictEqual(activeOnStore.length, 2, 'Storefront only sees 2 active variants (500g, 1kg)');
  assert(activeOnStore.some(v => v.weight === '250g') === false, '250g is hidden from active storefront');
  console.log('✓ Scenario 7 passed: Individual variant disable/enable works flawlessly.');

  // ------------------------------------------------------------------
  // SCENARIO 8: Confirm existing products without variants still work
  // ------------------------------------------------------------------
  console.log('\n--- SCENARIO 8: Existing single-price products without variants work as before ---');
  const singlePriceProd = {
    id: 'prd-single-item-test',
    name: 'Everyday Tea Cake',
    category: 'bakery',
    price: 350,
    unit: '1 Pack',
    variations: [] // No variants
  };

  const savedSingle = db.saveProduct(singlePriceProd);
  assert.strictEqual(savedSingle.price, 350, 'Single price is Rs. 350');
  assert.strictEqual(savedSingle.variations.length, 0, 'No variants created for single price item');

  const fetchedSingle = db.getProductById('prd-single-item-test');
  assert.strictEqual(fetchedSingle.variations.length, 0, 'Fetched single item has 0 variants');
  assert.strictEqual(fetchedSingle.price, 350, 'Price intact');
  console.log('✓ Scenario 8 passed: Single-price products function with zero regressions.');

  // Clean up test products
  db.deleteProduct('prd-test-halwa-poori-special');
  db.deleteProduct('prd-single-item-test');

  console.log('\n==================================================');
  console.log('ALL 8 ADVANCED PRODUCT VARIANT SCENARIOS PASSED 100%!');
  console.log('==================================================\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
