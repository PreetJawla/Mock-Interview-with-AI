import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/questions', async (req, res) => {
  const n = parseInt(req.query.n) || 5;
  const language = req.query.language || 'Java';
  const difficulty = req.query.difficulty || 'Intermediate';
  const prompt = `Generate ${n} unique technical interview questions for ${language} at ${difficulty} level. Return only the questions as a JSON array of strings.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    // Extract the first JSON array from the text
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) throw new Error('No JSON array found in Gemini response');
    const questions = JSON.parse(match[0]);
    res.json({ questions });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to fetch questions from Gemini' });
  }
});

export default router;