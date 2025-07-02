import express from 'express';

const router = express.Router();

// We'll import genAI dynamically to avoid circular dependency
let genAI;

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

    // Import genAI dynamically if not already imported
    if (!genAI) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const getTechnologyContext = (codingLanguage) => {
      const contexts = {
        'java': 'Java programming and software development',
        'cpp': 'C++ programming and system development',
        'python': 'Python programming and data science/web development',
        'javascript': 'JavaScript and web development',
        'mern': 'MERN stack and full-stack web development',
        'sql': 'SQL and database management',
        'dbms': 'Database management systems and theory',
        'react': 'React.js and frontend development',
        'nodejs': 'Node.js and backend development',
        'dsa': 'Data structures and algorithms'
      };
      return contexts[codingLanguage] || 'general programming';
    };

    // Limit question and answer length to 500 characters each to reduce token usage
    const trimmedQuestion = question.length > 500 ? question.slice(0, 500) : question;
    const trimmedAnswer = answer.length > 500 ? answer.slice(0, 500) : answer;

    // If the answer is 'No response recorded', do not call Gemini, just return a friendly message
    if (trimmedAnswer === 'No response recorded') {
      return res.json({
        feedback: 'No answer was recorded. Please try again and speak clearly into the microphone.',
        question,
        answer,
        language,
        codingLanguage,
        difficulty,
        timestamp: new Date().toISOString()
      });
    }
    // Concise prompt for Gemini with explicit length limit
    const prompt = `You are an expert technical interview coach for ${getTechnologyContext(codingLanguage)}.\nLanguage: ${language}\nDifficulty: ${difficulty}\n\nQuestion: \"${trimmedQuestion}\"\nAnswer: \"${trimmedAnswer}\"\n\nGive a brief, actionable, and encouraging assessment of the answer. Include a confidence score (1-10). Limit your feedback to 3 sentences and keep it under 100 words.`;

    // Log prompt length and content
    console.log('Gemini prompt length:', prompt.length);
    console.log('Gemini prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text().trim();
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
    if (error.message?.includes('GoogleGenerativeAI')) {
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