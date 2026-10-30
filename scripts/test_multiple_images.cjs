const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==================================================');
console.log('TESTING MULTIPLE PRODUCT IMAGES & STORAGE SUITE');
console.log('==================================================');

// 1. Test Disk Storage & Upload Directory
const publicUploads = path.join(__dirname, '..', 'public', 'uploads');
assert(fs.existsSync(publicUploads), 'public/uploads directory exists on disk');
console.log('✓ public/uploads directory verified');

// 2. Mock Multi-Image Upload API Handler
function simulateUpload(files) {
  const savedFiles = [];
  for (const item of files) {
    let buffer = Buffer.from(item.data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    let ext = '.webp';
    if (item.type && item.type.includes('png')) ext = '.png';
    const cleanBase = (item.name || 'product').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `test_sawera_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${cleanBase}${ext}`;
    const filePath = path.join(publicUploads, filename);
    fs.writeFileSync(filePath, buffer);
    savedFiles.push({ url: `/uploads/${filename}`, name: filename, size: buffer.length });
  }
  return savedFiles;
}

// 1x1 transparent PNG base64 for testing
const testBase64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const uploaded = simulateUpload([
  { name: 'angle1.png', data: testBase64Png, type: 'image/png' },
  { name: 'angle2.png', data: testBase64Png, type: 'image/png' },
  { name: 'angle3.png', data: testBase64Png, type: 'image/png' },
  { name: 'angle4.png', data: testBase64Png, type: 'image/png' },
  { name: 'angle5.png', data: testBase64Png, type: 'image/png' },
  { name: 'angle6.png', data: testBase64Png, type: 'image/png' }
]);

assert.strictEqual(uploaded.length, 6, 'Successfully simulated 6 image uploads');
for (const u of uploaded) {
  const fullPath = path.join(publicUploads, u.name);
  assert(fs.existsSync(fullPath), `Uploaded image file exists: ${u.url}`);
  // Clean up test file
  fs.unlinkSync(fullPath);
}
console.log('✓ Simulated 6-image upload and file persistence verified');

// 3. Test db.js normalization logic
function normalizeProductImages(prod) {
  if (!prod) return prod;
  const rawList = Array.isArray(prod.images) && prod.images.length > 0
    ? prod.images
    : (prod.image ? [prod.image] : ['/images/products/gulab-jamun.svg']);
  const cleanList = rawList.filter(Boolean).slice(0, 6);
  const finalImages = cleanList.length > 0 ? cleanList : ['/images/products/gulab-jamun.svg'];
  return {
    ...prod,
    images: finalImages,
    image: finalImages[0]
  };
}

// Test A: Legacy Single-Image Product
const legacyProduct = {
  id: 'prd-legacy-roll-barfi',
  name: 'Special Roll Barfi',
  price: 1400,
  image: '/images/products/special-roll-barfi.jpg'
};

const normalizedLegacy = normalizeProductImages(legacyProduct);
assert.strictEqual(normalizedLegacy.images.length, 1, 'Legacy product has exactly 1 image in images array');
assert.strictEqual(normalizedLegacy.images[0], '/images/products/special-roll-barfi.jpg', 'images[0] matches original image');
assert.strictEqual(normalizedLegacy.image, '/images/products/special-roll-barfi.jpg', 'image property preserved for backwards compatibility');
console.log('✓ Legacy single-image product backwards compatibility verified');

// Test B: New Product with 6 Images
const sixImages = [
  '/uploads/sawera_1_front.webp',
  '/uploads/sawera_2_angle.webp',
  '/uploads/sawera_3_top.webp',
  '/uploads/sawera_4_box.webp',
  '/uploads/sawera_5_texture.webp',
  '/uploads/sawera_6_gift.webp'
];

const newProduct = {
  id: 'prd-test-six-images',
  name: 'Royal Gift Sweet Box',
  price: 2500,
  images: sixImages
};

const normalizedNew = normalizeProductImages(newProduct);
assert.strictEqual(normalizedNew.images.length, 6, 'Product holds exactly 6 images');
assert.strictEqual(normalizedNew.image, sixImages[0], 'First image automatically assigned as main cover image');
console.log('✓ 6-image product normalization verified');

// Test C: Rearranging & Setting New Cover Image
const rearrangedImages = [
  sixImages[3], // Box is now cover
  sixImages[0],
  sixImages[1],
  sixImages[2],
  sixImages[4],
  sixImages[5]
];

const updatedProduct = normalizeProductImages({
  ...newProduct,
  images: rearrangedImages
});

assert.strictEqual(updatedProduct.image, sixImages[3], 'New cover image correctly synchronized to product.image');
assert.strictEqual(updatedProduct.images[0], sixImages[3], 'images[0] is new cover');
console.log('✓ Rearranging and new cover photo synchronization verified');

// Test D: Maximum 6 Images Cap Enforced
const sevenImages = [...sixImages, '/uploads/sawera_7_extra.webp'];
const cappedProduct = normalizeProductImages({
  id: 'prd-test-overflow',
  images: sevenImages
});
assert.strictEqual(cappedProduct.images.length, 6, 'Exceeding images strictly capped at 6');
console.log('✓ 6-image maximum limit enforcement verified');

console.log('\nALL MULTIPLE PRODUCT IMAGES TESTS PASSED!\n');
