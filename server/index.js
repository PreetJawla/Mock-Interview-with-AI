import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// Optional: MongoDB connection - only connect if URI is provided
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.log('MongoDB connection error:', err.message);
      console.log('Continuing without MongoDB - data will not be persisted');
    });
} else {
  console.log('MongoDB URI not provided - running without database');
}

// Import routes dynamically
const setupRoutes = async () => {
  try {
    const { default: interviewRoutes } = await import('./routes/interview.js');
    const { default: feedbackRoutes } = await import('./routes/feedback.js');
    const { default: geminiRoutes } = await import('./routes/gemini.js');
    
    app.use('/api/interview', interviewRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/gemini', geminiRoutes);
  } catch (error) {
    console.error('Error loading routes:', error);
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured',
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Setup routes and start server
setupRoutes().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/api/health`);
  });
}).catch(error => {
  console.error('Failed to setup routes:', error);
  process.exit(1);
});

export { ai };