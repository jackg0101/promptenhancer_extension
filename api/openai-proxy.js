// api/openai-proxy.js
export default function handler(req, res) {
  // Log the incoming authorization header to check its format
  console.log('Authorization header:', req.headers.authorization);
  
  // Optional: Check for authorization
  // For example, check for an API token in headers
  const authToken = req.headers.authorization;
  
  // Make sure AUTH_TOKEN is set in your Vercel environment variables
  if (authToken !== `Bearer ${process.env.AUTH_TOKEN}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Get OpenAI API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Return success response
  // Note: In a real implementation, you would likely proxy the request to OpenAI
  // rather than returning the API key directly
  res.status(200).json({
    success: true,
    message: 'API successfully accessed'
  });
}
