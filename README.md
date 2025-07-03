# AI Mock Interview Practice App

A full-stack MERN application that provides AI-powered mock interview practice with real-time speech recognition and personalized feedback.

**GitHub Repository:**  
[https://github.com/PreetJawla/Mock-Interview-with-AI](https://github.com/PreetJawla/Mock-Interview-with-AI)

---

## Features

- **Multi-domain Support**: Practice interviews in a wide range of technical domains
- **AI-Powered Questions**: Dynamic interview questions generated using Gemini AI
- **Real-time Speech Recognition**: Browser-based speech-to-text conversion
- **Instant AI Feedback**: Constructive feedback and suggestions for improvement
- **Clean Modern UI**: Responsive design with smooth animations
- **20-Second Timer**: Timed responses to simulate real interview conditions

---

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Web Speech API for speech recognition
- Vite for development and building

### Backend
- Node.js with Express
- Gemini AI API for question generation and feedback
- MongoDB (optional) for session storage
- CORS enabled for cross-origin requests

---

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Configuration (Optional)
MONGODB_URI=mongodb://localhost:27017/ai-interview-app

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Frontend (port 3000)
npm run client

# Backend (port 3001)
npm run server
```

---

## Usage

1. **Select Technical Domain**: Choose from a wide range of supported domains
2. **Generate Question**: Click to get an AI-generated interview question
3. **Record Answer**: Speak your response within the 20-second timer or type it manually
4. **Get Feedback**: Receive detailed AI feedback on your answer
5. **Continue Practice**: Move to the next question or next set to keep practicing

---

## Supported Technical Domains

- Java
- C++
- Python
- JavaScript
- MERN Stack
- SQL
- DBMS
- React
- Node.js
- Data Structures & Algorithms
- .NET
- Coding Challenge Questions
- Computer Networks
- Operating System
- OOPs Concepts
- System Design
- DevOps
- AI/ML Basics
- Cloud Computing
- Linux & Shell

---

## Browser Compatibility

The Speech Recognition API is supported in:
- Chrome (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

---

## API Endpoints

### Interview Routes
- `GET /api/gemini/questions` - Generate interview questions (with domain and difficulty)
- `GET /api/interview/languages` - Get supported languages

### Feedback Routes
- `POST /api/feedback/generate-feedback` - Generate AI feedback

### Health Check
- `GET /api/health` - Server health status

---

## Project Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── InterviewSession.tsx
│   │   ├── QuestionDisplay.tsx
│   │   ├── SpeechRecorder.tsx
│   │   └── FeedbackDisplay.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── types/             # TypeScript definitions
│   │   └── speech.d.ts
│   └── App.tsx
├── server/
│   ├── routes/            # Express routes
│   │   ├── gemini.js
│   │   └── feedback.js
│   ├── models/            # MongoDB models
│   │   └── Session.js
│   └── index.js
└── README.md
```

---

## Customization

### Adding New Domains

1. Update the `codingLanguages` array in `src/components/LanguageSelector.tsx`
2. Ensure your backend prompt in `server/routes/gemini.js` uses the selected domain and difficulty

### Modifying AI Prompts

Edit the prompts in:
- `server/routes/gemini.js` - Question generation
- `server/routes/feedback.js` - Feedback generation

### Styling

The app uses Tailwind CSS. Customize the design by:
- Modifying utility classes in components
- Updating the color scheme in `tailwind.config.js`
- Adding custom CSS in `src/index.css`

---

## Deployment

### Frontend

You can deploy the frontend (React app) on [Netlify](https://netlify.com), [Vercel](https://vercel.com), or any static hosting provider:

```bash
npm run build
```
- Deploy the `dist` (Vite) or `build` (CRA) folder.

### Backend

Deploy your backend (Express server) on [Render](https://render.com), [Railway](https://railway.app), [Heroku](https://heroku.com), or similar.  
**Update your frontend API URLs to point to your deployed backend.**

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is licensed under the MIT License.

---