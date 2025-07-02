import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false // Optional for anonymous sessions
  },
  language: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    answer: String,
    feedback: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Session', sessionSchema);