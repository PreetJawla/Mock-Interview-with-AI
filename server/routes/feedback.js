import express from 'express';

const router = express.Router();

// We'll import ai dynamically to avoid circular dependency
let ai;

// Generate feedback for user's answer
router.post('/generate-feedback', async (req, res) => {
  try {
    const { question, answer, language, codingLanguage, difficulty } = req.body;

    if (!question || !answer || !language) {
      return res.status(400).json({ error: 'Question, answer, and language are required' });
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

    // Build the prompt for feedback generation
    const prompt = `You are an expert technical interviewer. Evaluate the following interview response:

Question: ${question}
Candidate's Answer: ${answer}
Spoken Language: ${language}
${codingLanguage ? `Programming Language: ${codingLanguage}` : ''}
${difficulty ? `Difficulty Level: ${difficulty}` : ''}

Provide constructive feedback including:
1. Strengths of the answer
2. Areas for improvement
3. Accuracy and completeness
4. Clarity and communication
5. A rating out of 10

Be specific and actionable in your feedback.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const feedback = response.text.trim();
    // Log response length and content
    console.log('Gemini response length:', feedback.length);
    console.log('Gemini response:', feedback);

    res.json({ 
      feedback,
      question,
      answer,
      language,
      codingLanguage,
      difficulty,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating feedback:', error);
    
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
    
    res.status(500).json({ 
      error: 'Failed to generate feedback',
      type: 'general_error'
    });
  }
});

export default router;