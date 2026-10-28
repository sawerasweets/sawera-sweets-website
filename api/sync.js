// Vercel Serverless Function: Cross-Device State Synchronization
// Handles GET and POST for Sawera Sweets store data

let inMemoryStore = {
  settings: null,
  categories: null,
  products: null,
  deleted_product_ids: []
};

export default function handler(req, res) {
  // CORS Headers
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

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: inMemoryStore
    });
  }

  if (req.method === 'POST') {
    try {
      const { collection, data } = req.body || {};
      if (collection && data !== undefined) {
        inMemoryStore[collection] = data;
        return res.status(200).json({
          success: true,
          message: `Collection "${collection}" updated successfully.`,
          timestamp: new Date().toISOString()
        });
      }
      return res.status(400).json({ success: false, error: 'Invalid payload: collection and data required.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
