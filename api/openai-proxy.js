export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Print debug info
  console.log('Auth token from env:', process.env.AUTH_TOKEN);
  console.log('Auth header received:', req.headers.authorization);
  
  // Check authorization with more flexibility
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith('Bearer ') || 
      authToken.replace('Bearer ', '') !== process.env.AUTH_TOKEN) {
    return res.status(403).json({ 
      error: 'Unauthorized',
      receivedToken: authToken || 'none'
    });
  }
  
  try {
    // Get the OpenAI key
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Forward the request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
