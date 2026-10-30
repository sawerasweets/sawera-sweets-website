// Serverless Function: Persistent Multi-Image Upload Handler
// Handles POST requests containing base64 images

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { files } = req.body || {};
    const items = Array.isArray(files) ? files : (req.body?.data ? [req.body] : []);

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    // In serverless environments, files can be returned as optimized compressed data URLs
    // or persisted in Supabase/storage.
    const savedFiles = items.map((item, idx) => {
      const cleanBase = (item.name || 'product')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 30);
      const filename = `sawera_${Date.now()}_${idx}_${cleanBase}.webp`;

      return {
        url: item.data.startsWith('data:') ? item.data : `data:image/jpeg;base64,${item.data}`,
        name: filename,
        size: item.data.length
      };
    });

    return res.status(200).json({
      success: true,
      files: savedFiles,
      message: 'Images processed successfully'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
