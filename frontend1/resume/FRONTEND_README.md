# ResuMate Frontend - React + Vite

## 🚀 Features

This is a comprehensive React frontend for the ResuMate AI-powered resume and interview platform.

### Features Implemented:

1. **📄 Resume Upload** - Upload PDF/TXT resumes
2. **🎯 Resume Analysis** - AI-powered resume analysis against job descriptions
3. **✨ Resume Improvement** - Get AI suggestions to improve your resume
4. **💬 Resume Q&A** - Interactive chat to ask questions about your resume
5. **🎤 Mock Interview** - Practice interview questions with AI scoring
6. **🔍 Job Search** - Search jobs on multiple platforms (Adzuna, Jooble)
7. **⚙️ Settings** - Configure AI provider (Groq, OpenAI, Ollama)

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - API calls
- **CSS3** - Styling with gradients and animations

## 📦 Installation

Dependencies already installed:
```bash
npm install
```

## 🎮 Running the Application

### Start Frontend (Port 5174):
```bash
npm run dev
```

### Start Backend (Port 8000):
```bash
cd ../..
python backend.py
```

## 🌐 URLs

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📋 Usage

1. **Start the backend first** (from project root):
   ```bash
   python backend.py
   ```

2. **Start the frontend**:
   ```bash
   cd frontend1/resume
   npm run dev
   ```

3. **Open browser** to http://localhost:5174

4. **Navigation**:
   - Click on any tab in the navigation bar
   - Upload a resume first before using other features
   - Configure settings if you want to use custom API keys

## 🎨 Components

### ResumeUpload
- Upload PDF or TXT files
- View list of uploaded resumes
- Automatic file validation

### ResumeAnalysis
- Enter job role and requirements
- Get detailed skill matching
- See strengths and recommendations
- Visual skill ratings

### ResumeImprovement
- Get AI-powered improvement suggestions
- Section-by-section improvements
- Actionable recommendations

### ResumeQA
- Interactive chat interface
- Ask questions about your resume
- Context-aware responses
- Chat history support

### MockInterview
- Configure interview settings
- Answer questions step by step
- Real-time scoring
- Comprehensive summary with feedback

### JobSearch
- Search jobs by keywords and location
- Multiple platform support
- Direct application links
- Detailed job descriptions

### Settings
- Choose LLM provider (Groq/OpenAI/Ollama)
- Configure API keys
- Set custom models

## 🎯 API Integration

All components are connected to the FastAPI backend at `http://localhost:8000`

API endpoints used:
- `/api/resume/upload` - Upload resume
- `/api/resume/analyze` - Analyze resume
- `/api/resume/improve` - Get improvements
- `/api/resume/ask` - Q&A
- `/api/interview/start` - Start interview
- `/api/interview/submit` - Submit answers
- `/api/interview/summary/{id}` - Get summary
- `/api/jobs/search` - Search jobs
- `/api/settings` - Get/Update settings

## 🎨 Styling

- Modern gradient design
- Responsive layout
- Smooth animations
- Custom scrollbars
- Professional color scheme:
  - Primary: #3498db (Blue)
  - Success: #2ecc71 (Green)
  - Gradient: #667eea → #764ba2

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

## 📝 Notes

- Backend must be running on port 8000
- CORS is configured for localhost
- No authentication required (simplified for demo)
- Default user_id is 1

## 🎉 Enjoy!

Your complete ResuMate application is ready to use!
