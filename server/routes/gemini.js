import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/questions', async (req, res) => {
  const n = parseInt(req.query.n) || 5;
  const prompt = `Generate ${n} technical interview questions for Java. Return only the questions as a JSON array of strings.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const questions = JSON.parse(text);
    res.json({ questions });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to fetch questions from Gemini' });
  }
});

export default router;