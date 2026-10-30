import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function uploadApiPlugin() {
  return {
    name: 'sawera-upload-api',
    configureServer(server) {
      server.middlewares.use('/api/upload', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const items = Array.isArray(parsed.files) ? parsed.files : (parsed.data ? [parsed] : []);
              const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
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

                fs.writeFileSync(path.join(uploadsDir, filename), buffer);

                savedFiles.push({
                  url: `/uploads/${filename}`,
                  name: filename,
                  size: buffer.length
                });
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, files: savedFiles }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    uploadApiPlugin(),
  ],
});


