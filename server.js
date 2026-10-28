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

// Serve static assets from Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: send index.html for all frontend routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sawera Sweets & Bakers server listening on port ${PORT}`);
});
