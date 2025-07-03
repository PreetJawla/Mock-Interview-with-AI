import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interview API functions
export const generateQuestion = async (language: string, difficulty = 'medium', category = 'general') => {
  const response = await api.post('/interview/generate-question', {
    language,
    difficulty,
    category
  });
  return response.data;
};

// Feedback API functions
export const generateFeedback = async (
  question: string, 
  answer: string, 
  language: string, 
  codingLanguage?: string, 
  difficulty?: string
) => {
  const response = await api.post('/feedback/generate-feedback', {
    question,
    answer,
    language,
    codingLanguage,
    difficulty
  });
  return response.data;
};

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;