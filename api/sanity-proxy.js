export default async function handler(req, res) {
  // Extract the Sanity Project ID and Dataset from query params, or default to the old database
  const projectId = req.query.projectId || '6xblaggo';
  const dataset = req.query.dataset || 'production';
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Construct the Sanity API URL
  const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    // Server-side fetch (Bypasses all browser CORS restrictions!)
    const response = await fetch(url);
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow our frontend to read this
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Sanity', details: error.message });
  }
}
