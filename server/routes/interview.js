import express from 'express';

const router = express.Router();

// We'll import genAI dynamically to avoid circular dependency
let genAI;

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

    // Import genAI dynamically if not already imported
    if (!genAI) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a more specific prompt for coding interviews
    const getCategoryPrompt = (category) => {
      const categoryPrompts = {
        'java': 'Java programming concepts, OOP principles, collections, multithreading, JVM, Spring framework, or Java-specific algorithms',
        'cpp': 'C++ programming concepts, memory management, pointers, STL, object-oriented programming, or C++-specific algorithms',
        'python': 'Python programming concepts, data structures, libraries (pandas, numpy), Django/Flask, or Python-specific algorithms',
        'javascript': 'JavaScript concepts, ES6+, DOM manipulation, async programming, Node.js, or web development',
        'mern': 'MERN stack (MongoDB, Express.js, React.js, Node.js), full-stack development, REST APIs, or web application architecture',
        'sql': 'SQL queries, database design, joins, indexing, normalization, or database optimization',
        'dbms': 'Database management systems, ACID properties, transactions, concurrency control, or database theory',
        'react': 'React.js concepts, hooks, state management, component lifecycle, or React ecosystem',
        'nodejs': 'Node.js concepts, Express.js, npm, asynchronous programming, or backend development',
        'dsa': 'Data structures and algorithms, time complexity, space complexity, sorting, searching, or problem-solving'
      };
      return categoryPrompts[category] || 'general programming concepts';
    };

    const getDifficultyDescription = (difficulty) => {
      const descriptions = {
        'beginner': 'basic level suitable for entry-level positions or students',
        'intermediate': 'moderate level suitable for mid-level developers with some experience',
        'advanced': 'challenging level suitable for senior developers or complex problem-solving'
      };
      return descriptions[difficulty] || 'moderate level';
    };

    const prompt = `Generate a single technical interview question in ${language} language.

    Requirements:
    - Topic: ${getCategoryPrompt(category)}
    - Difficulty: ${getDifficultyDescription(difficulty)}
    - The question should be professional and suitable for a technical job interview
    - Focus on practical knowledge and problem-solving skills
    - Make it clear and specific
    - The question should allow for a verbal explanation/answer (not requiring code writing)
    - Suitable for a 20-second verbal response that demonstrates understanding
    
    Return only the question text without any additional formatting, explanations, or prefixes.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text().trim();

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
    if (error.message?.includes('GoogleGenerativeAI')) {
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