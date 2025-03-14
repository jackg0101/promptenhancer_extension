export default function handler(req, res) {
  // Simply return success with env variable existence check
  res.status(200).json({
    success: true,
    authTokenExists: !!process.env.AUTH_TOKEN,
    openaiKeyExists: !!process.env.OPENAI_API_KEY
  });
}
