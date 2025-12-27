import express from 'express';

const router = express.Router();

// We'll import ai dynamically to avoid circular dependency
let ai;

// Generate interview question
router.post('/generate-question', async (req, res) => {
  try {
    const { language, difficulty = 'medium', category = 'general' } = req.body;

    if (!language) {
      return res.status(400).json({ error: 'Language is required' });
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Import ai dynamically if not already imported
    if (!ai) {
      const { GoogleGenAI } = await import('@google/genai');
      ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    }

    // Build the prompt for question generation
    const prompt = `Generate a single ${difficulty} level technical interview question about ${language}${category !== 'general' ? ` focusing on ${category}` : ''}. 

The question should:
- Be clear and specific
- Be appropriate for a ${difficulty} difficulty level
- Test practical knowledge
- Be answerable in 2-5 minutes

Return only the question text, nothing else.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const question = response.text.trim();

    res.json({ 
      question,
      language,
      difficulty,
      category,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating question:', error);
    
    // Handle specific API quota errors
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(500).json({ 
        error: 'AI service quota exceeded. Please try again later.',
        type: 'quota_exceeded'
      });
    }
    
    // Handle other API errors
    if (error.message?.includes('GoogleGenAI')) {
      return res.status(500).json({ 
        error: 'AI service temporarily unavailable. Please try again later.',
        type: 'api_error'
      });
    }
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ 
        error: 'Invalid or missing Gemini API key',
        type: 'auth_error'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate question',
      details: error.message,
      type: 'general_error'
    });
  }
});

// Get available languages
router.get('/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ];
  
  res.json({ languages });
});

export default router;