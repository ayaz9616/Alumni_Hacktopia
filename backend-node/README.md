# ResuMate Node.js Backend

AI-Powered Resume Tracking and Mock Interview System built with Node.js, Express, TypeScript, and MongoDB.

## Features

✅ Resume Upload & Analysis  
✅ AI-Powered Resume Improvement  
✅ Mock Interview with Q&A  
✅ Job Search Integration  
✅ Smart Recommendations  
✅ MongoDB Database  
✅ TypeScript Support  

## Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account or local MongoDB instance
- API Keys (GROQ_API_KEY or OPENAI_API_KEY)

## Installation

1. **Navigate to the backend-node directory:**
   ```bash
   cd backend-node
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp ../.env .env
   ```

   Or create a new `.env` file with:
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
   PORT=8000
   FRONTEND_URL=http://localhost:3000
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   JOOBLE_API_KEY=your_jooble_api_key
   ```

## Running the Server

### Development Mode (with hot reload):
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /` - API information
- `GET /api/health` - Health check

### Resume
- `POST /api/resume/upload` - Upload resume (PDF/TXT)
- `GET /api/resume/list` - List user's resumes
- `POST /api/resume/analyze` - Analyze resume
- `POST /api/resume/improve` - Get improvement suggestions
- `POST /api/resume/ask` - Ask questions about resume

### Interview
- `POST /api/interview/start` - Start mock interview
- `POST /api/interview/submit` - Submit answer
- `GET /api/interview/summary/:id` - Get interview summary

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Jobs
- `POST /api/jobs/search` - Search for jobs

## Project Structure

```
backend-node/
├── src/
│   ├── agents/           # AI agents
│   │   └── ResumeAnalysisAgent.ts
│   ├── middleware/       # Express middleware
│   │   └── error.middleware.ts
│   ├── models/           # MongoDB models
│   │   ├── User.ts
│   │   ├── Resume.ts
│   │   ├── Analysis.ts
│   │   └── UserSettings.ts
│   ├── routes/           # API routes
│   │   ├── resume.routes.ts
│   │   ├── interview.routes.ts
│   │   ├── job.routes.ts
│   │   └── settings.routes.ts
│   ├── utils/            # Utilities
│   │   └── fileHandler.ts
│   └── index.ts          # Entry point
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Migrating from Python FastAPI

This Node.js backend is a complete port of the FastAPI backend with the following changes:

1. **Language**: Python → TypeScript/JavaScript
2. **Framework**: FastAPI → Express
3. **Type System**: Pydantic → TypeScript interfaces
4. **File Uploads**: Python file handling → Multer
5. **AI Libraries**: LangChain Python → LangChain.js
6. **Database**: pymongo → mongoose

All API endpoints maintain the same interface for frontend compatibility.

## Connecting Frontend

Update your React frontend to point to:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## Troubleshooting

**MongoDB Connection Error:**
- Verify your MONGO_URI in .env
- Check MongoDB Atlas whitelist settings
- Ensure network connectivity

**Port Already in Use:**
```bash
# Change PORT in .env file
PORT=8001
```

**Module Not Found:**
```bash
npm install
npm run build
```

## License

MIT
