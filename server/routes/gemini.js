import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/questions', async (req, res) => {
  const n = parseInt(req.query.n) || 5;
  const language = req.query.language || 'Java';
  const difficulty = req.query.difficulty || 'Intermediate';
  // Add a random seed to the prompt to encourage variety
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const prompt = `Generate ${n} unique and different technical interview questions for ${language} at ${difficulty} level. Make sure the questions are not repeated from previous requests. Random seed: ${randomSeed}. Return only the questions as a JSON array of strings.`;

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