# AI Mock Interview Practice App

A full-stack MERN application that provides AI-powered mock interview practice with real-time speech recognition and personalized feedback.

## Features

- **Multi-language Support**: Practice interviews in 8 different languages
- **AI-Powered Questions**: Dynamic interview questions generated using Gemini AI
- **Real-time Speech Recognition**: Browser-based speech-to-text conversion
- **Instant AI Feedback**: Constructive feedback and suggestions for improvement
- **Clean Modern UI**: Responsive design with smooth animations
- **20-Second Timer**: Timed responses to simulate real interview conditions

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

## Usage

1. **Select Language**: Choose from 8 supported languages
2. **Generate Question**: Click to get an AI-generated interview question
3. **Record Answer**: Speak your response within the 20-second timer
4. **Get Feedback**: Receive detailed AI feedback on your answer
5. **Continue Practice**: Move to the next question to keep practicing

## Supported Languages

- English 🇺🇸
- Hindi 🇮🇳
- Spanish 🇪🇸
- French 🇫🇷
- German 🇩🇪
- Japanese 🇯🇵
- Korean 🇰🇷
- Chinese 🇨🇳

## Browser Compatibility

The Speech Recognition API is supported in:
- Chrome (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

## API Endpoints

### Interview Routes
- `GET /api/interview/languages` - Get supported languages
- `POST /api/interview/generate-question` - Generate interview question

### Feedback Routes
- `POST /api/feedback/generate-feedback` - Generate AI feedback

### Health Check
- `GET /api/health` - Server health status

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
│   │   ├── interview.js
│   │   └── feedback.js
│   ├── models/            # MongoDB models
│   │   └── Session.js
│   └── index.js
└── README.md
```

## Customization

### Adding New Languages

1. Update the languages array in `server/routes/interview.js`
2. Add language codes to the mapping in `SpeechRecorder.tsx`
3. Test speech recognition support for the new language

### Modifying AI Prompts

Edit the prompts in:
- `server/routes/interview.js` - Question generation
- `server/routes/feedback.js` - Feedback generation

### Styling

The app uses Tailwind CSS. Customize the design by:
- Modifying utility classes in components
- Updating the color scheme in `tailwind.config.js`
- Adding custom CSS in `src/index.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.