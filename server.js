import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side persistent storage for cross-device consistency (Mobile + Desktop sync)
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'server-store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readServerStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading server store:', err.message);
  }
  return {};
}

function writeServerStore(store) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error writing server store:', err.message);
  }
}

// API Endpoints for Authoritative Cross-Device Sync
app.get('/api/sync', (req, res) => {
  const store = readServerStore();
  res.json({ success: true, data: store });
});

app.post('/api/sync', (req, res) => {
  try {
    const { collection, data } = req.body;
    if (!collection) {
      return res.status(400).json({ success: false, message: 'Collection name required' });
    }
    const store = readServerStore();
    store[collection] = data;
    store.updatedAt = new Date().toISOString();
    writeServerStore(store);
    res.json({ success: true, collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Persistent Upload Storage Directory (public/uploads and dist/uploads)
const PUBLIC_UPLOADS = path.join(__dirname, 'public', 'uploads');
const DIST_UPLOADS = path.join(__dirname, 'dist', 'uploads');
if (!fs.existsSync(PUBLIC_UPLOADS)) fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });
if (!fs.existsSync(DIST_UPLOADS)) fs.mkdirSync(DIST_UPLOADS, { recursive: true });

// Serve uploaded images statically
app.use('/uploads', express.static(PUBLIC_UPLOADS));
app.use('/uploads', express.static(DIST_UPLOADS));

// API Endpoint for Persistent Image Upload (Supports up to 6 images per product)
app.post('/api/upload', (req, res) => {
  try {
    const { files } = req.body || {};
    const items = Array.isArray(files) ? files : (req.body?.data ? [req.body] : []);

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'No file data received' });
    }

    const savedFiles = [];
    for (const item of items) {
      if (!item.data) continue;

      let buffer;
      let ext = '.jpg';
      const matches = item.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches.length === 3) {
        const mime = matches[1].toLowerCase();
        if (mime.includes('png')) ext = '.png';
        else if (mime.includes('webp')) ext = '.webp';
        else if (mime.includes('svg')) ext = '.svg';
        else if (mime.includes('gif')) ext = '.gif';
        else ext = '.jpg';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(item.data, 'base64');
        if (item.name) {
          ext = path.extname(item.name) || '.jpg';
        }
      }

      const cleanBase = (item.name || 'product')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 30);
      const filename = `sawera_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${cleanBase}${ext}`;

      const publicPath = path.join(PUBLIC_UPLOADS, filename);
      fs.writeFileSync(publicPath, buffer);

      try {
        const distPath = path.join(DIST_UPLOADS, filename);
        fs.writeFileSync(distPath, buffer);
      } catch (err) {
        // Ignore if dist is not yet built
      }

      savedFiles.push({
        url: `/uploads/${filename}`,
        name: filename,
        size: buffer.length
      });
    }

    res.json({ success: true, files: savedFiles });
  } catch (err) {
    console.error('Server upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve static assets from Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: send index.html for all frontend routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sawera Sweets & Bakers server listening on port ${PORT}`);
});
