export default async function handler(req, res) {
  // Check the authorization header
  const authToken = req.headers.authorization;
  
  if (authToken !== `Bearer ${process.env.AUTH_TOKEN}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Get the OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Forward the request to OpenAI
  try {
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
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ error: 'Error calling OpenAI API' });
  }
}
