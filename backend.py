"""
FastAPI Backend for ResuMate - AI-Powered Resume Tracking and Mock Interview System
Author: ResuMate Team
Version: 1.0.0
"""

from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
import os
import io
import json
import time
import uuid
import hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database functions
from database import (
    init_mysql_db,
    create_user,
    get_user_by_email,
    save_user_resume,
    get_user_resume_by_id,
    get_user_resumes,
    get_user_settings,
    save_user_settings,
)

# Import models
from api.models import (
    UserRegister,
    UserLogin,
    Token,
    UserSettings,
    UserSettingsUpdate,
    ResumeUploadResponse,
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    ResumeImprovementRequest,
    ResumeImprovementResponse,
    QuestionRequest,
    QuestionResponse,
    InterviewStartRequest,
    InterviewStartResponse,
    InterviewQuestion,
    AnswerSubmission,
    AnswerSubmissionResponse,
    AnswerScore,
    InterviewSummary,
    JobSearchRequest,
    JobSearchResponse,
    JobListing,
    SuccessResponse,
)

# Import agents
from agents import ResumeAnalysisAgent
from agents.job_search_agent import JobAgent

# Import utilities
from utils.file_handlers import extract_text_from_file

# In-memory storage for sessions and caches
user_analysis_cache: Dict[int, Dict[str, Any]] = {}
active_interviews: Dict[str, Dict[str, Any]] = {}


# ==================== LIFESPAN MANAGEMENT ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager - handles startup and shutdown"""
    # Startup
    print("🚀 Starting ResuMate FastAPI Backend...")
    try:
        init_mysql_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
    
    print("✅ ResuMate API is ready!")
    
    yield
    
    # Shutdown
    print("👋 Shutting down ResuMate API...")


# ==================== FASTAPI APP INITIALIZATION ====================

app = FastAPI(
    title="ResuMate API",
    description="AI-powered Resume Tracking and Mock Interview System with Intelligent Career Assistance",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ==================== CORS CONFIGURATION ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default
        "http://localhost:5174",  # Vite alternate
        "http://localhost:8501",  # Streamlit default
        "http://localhost:8000",
        os.getenv("FRONTEND_URL", "*"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== HELPER FUNCTIONS ====================

def get_user_agent(user_id: int = Query(default=1, description="User ID for session management")):
    """Get or create ResumeAnalysisAgent for user"""
    # Get user settings if available
    settings = get_user_settings(user_id) or {}
    
    provider = settings.get("provider", "groq")
    api_key = settings.get("api_key") or os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
    model = settings.get("model")
    ollama_base_url = settings.get("ollama_base_url", "http://localhost:11434")
    
    if not api_key and provider in ["openai", "groq"]:
        # Use default API key from environment
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"API key not configured. Set GROQ_API_KEY or OPENAI_API_KEY environment variable."
            )
    
    agent = ResumeAnalysisAgent(
        api_key=api_key,
        provider=provider,
        model=model,
        user_id=user_id
    )
    
    return agent


# ==================== ROOT & HEALTH ENDPOINTS ====================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "ResuMate API",
        "version": "1.0.0",
        "description": "AI-Powered Resume Tracking and Mock Interview System",
        "docs": "/api/docs",
        "status": "healthy",
        "features": [
            "Resume Analysis & Scoring",
            "AI-Powered Resume Improvement",
            "Mock Interview with Q&A",
            "Job Search Integration",
            "Smart Recommendations",
        ]
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        from database import get_db_connection
        conn = get_db_connection()
        if conn:
            conn.close()
            db_status = "connected"
        else:
            db_status = "disconnected"
    except:
        db_status = "error"
    
    return {
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


# ==================== USER SETTINGS ROUTES ====================

@app.get("/api/settings", response_model=UserSettings, tags=["Settings"])
async def get_settings(user_id: int = Query(default=1, description="User ID")):
    """
    Get user settings
    
    - **user_id**: User ID (default: 1)
    """
    try:
        settings = get_user_settings(user_id)
        
        if not settings:
            # Return defaults
            return UserSettings(
                provider="groq",
                api_key=None,
                model=None,
                ollama_base_url="http://localhost:11434",
                ollama_model="llama3.1:8b"
            )
        
        return UserSettings(
            provider=settings.get("provider", "groq"),
            api_key=settings.get("api_key"),
            model=settings.get("model"),
            ollama_base_url=settings.get("ollama_base_url", "http://localhost:11434"),
            ollama_model=settings.get("ollama_model", "llama3.1:8b")
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch settings: {str(e)}"
        )


@app.put("/api/settings", response_model=SuccessResponse, tags=["Settings"])
async def update_settings(
    settings: UserSettingsUpdate,
    user_id: int = Query(default=1, description="User ID")
):
    """
    Update user settings
    
    - **provider**: LLM provider (openai, groq, ollama)
    - **api_key**: API key for the provider
    - **model**: Model name
    - **ollama_base_url**: Ollama base URL (for ollama provider)
    - **ollama_model**: Ollama model name (for ollama provider)
    - **user_id**: User ID (default: 1)
    """
    try:
        
        # Get current settings
        current_settings = get_user_settings(user_id) or {}
        
        # Update with new values (only if provided)
        if settings.provider is not None:
            current_settings["provider"] = settings.provider.value
        if settings.api_key is not None:
            current_settings["api_key"] = settings.api_key
        if settings.model is not None:
            current_settings["model"] = settings.model
        if settings.ollama_base_url is not None:
            current_settings["ollama_base_url"] = settings.ollama_base_url
        if settings.ollama_model is not None:
            current_settings["ollama_model"] = settings.ollama_model
        
        # Save updated settings
        success = save_user_settings(user_id, current_settings)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save settings"
            )
        
        return SuccessResponse(
            success=True,
            message="Settings updated successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update settings: {str(e)}"
        )


# ==================== RESUME ROUTES ====================

@app.post("/api/resume/upload", response_model=ResumeUploadResponse, tags=["Resume"])
async def upload_resume(
    file: UploadFile = File(...),
    user_id: int = Query(default=1, description="User ID")
):
    """
    Upload a resume file (PDF or TXT)
    
    - **file**: Resume file to upload
    - **user_id**: User ID (default: 1)
    """
    try:
        
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.txt')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF and TXT files are supported"
            )
        
        # Read file content
        content = await file.read()
        file_obj = io.BytesIO(content)
        file_obj.name = file.filename
        
        # Extract text
        try:
            resume_text = extract_text_from_file(file_obj)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to extract text from file: {str(e)}"
            )
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume text is too short or empty"
            )
        
        # Save to database
        resume_hash = hashlib.sha256(resume_text.encode("utf-8")).hexdigest()
        resume_id = save_user_resume(user_id, file.filename, resume_hash, resume_text)
        
        if not resume_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save resume"
            )
        
        # Return preview
        preview = resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
        
        return ResumeUploadResponse(
            message="Resume uploaded successfully",
            resume_id=resume_id,
            text_preview=preview
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )


@app.get("/api/resume/list", tags=["Resume"])
async def list_resumes(user_id: int = Query(default=1, description="User ID")):
    """
    Get list of user's uploaded resumes
    
    - **user_id**: User ID (default: 1)
    """
    try:
        resumes = get_user_resumes(user_id)
        return {"resumes": resumes or []}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch resumes: {str(e)}"
        )


@app.post("/api/resume/analyze", response_model=ResumeAnalysisResponse, tags=["Resume"])
async def analyze_resume(
    request: ResumeAnalysisRequest,
    resume_id: Optional[int] = None,
    user_id: int = Query(default=1, description="User ID"),
    agent: ResumeAnalysisAgent = Depends(get_user_agent)
):
    """
    Analyze resume against job requirements
    
    - **role**: Target job role
    - **cutoff_score**: Minimum score threshold (0-100)
    - **jd_text**: Optional job description text
    - **custom_skills**: Optional list of required skills
    - **resume_id**: Optional resume ID (uses latest if not provided)
    - **user_id**: User ID (default: 1)
    """
    try:
        
        # Get resume text
        if resume_id:
            resume_data = get_user_resume_by_id(user_id, resume_id)
        else:
            all_resumes = get_user_resumes(user_id)
            if not all_resumes:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No resume found. Please upload a resume first."
                )
            latest_id = all_resumes[0].get("id") if isinstance(all_resumes[0], dict) else all_resumes[0]
            resume_data = get_user_resume_by_id(user_id, latest_id)
        
        if not resume_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found"
            )
        
        resume_text = resume_data.get("resume_text", "")
        
        # Set resume text in agent
        agent.resume_text = resume_text
        
        # Analyze resume
        result = agent.analyze_resume(
            role=request.role,
            cutoff_score=request.cutoff_score,
            jd_text=request.jd_text,
            custom_skills=request.custom_skills
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Analysis failed"
            )
        
        # Cache analysis for subsequent improvement calls
        user_analysis_cache[user_id] = {
            "resume_text": resume_text,
            "analysis": result,
        }
        
        return ResumeAnalysisResponse(
            overall_score=result.get("overall_score", 0),
            matching_skills=result.get("matching_skills", []),
            missing_skills=result.get("missing_skills", []),
            skill_scores=result.get("skill_scores", {}),
            strengths=result.get("strengths", []),
            weaknesses=result.get("weaknesses", []),
            recommendations=result.get("recommendations", []),
            resume_hash=result.get("resume_hash", "")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@app.post("/api/resume/improve", response_model=ResumeImprovementResponse, tags=["Resume"])
async def improve_resume(
    request: ResumeImprovementRequest,
    resume_id: Optional[int] = None,
    user_id: int = Query(default=1, description="User ID"),
    agent: ResumeAnalysisAgent = Depends(get_user_agent)
):
    """
    Get resume improvement suggestions
    
    - **focus_areas**: Optional list of areas to focus on
    - **resume_id**: Optional resume ID (uses cached analysis if available)
    - **user_id**: User ID (default: 1)
    """
    try:
        
        # Try to get cached analysis
        cached = user_analysis_cache.get(user_id)
        if cached:
            agent.resume_text = cached.get("resume_text")
            agent.analysis_result = cached.get("analysis")
        else:
            # Get resume from database
            if resume_id:
                resume_data = get_user_resume_by_id(user_id, resume_id)
            else:
                all_resumes = get_user_resumes(user_id)
                if not all_resumes:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="No resume found"
                    )
                latest_id = all_resumes[0].get("id") if isinstance(all_resumes[0], dict) else all_resumes[0]
                resume_data = get_user_resume_by_id(user_id, latest_id)
            
            if not resume_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found"
                )
            
            agent.resume_text = resume_data.get("resume_text", "")
        
        # Generate improvements
        improvements = agent.suggest_improvements(focus_areas=request.focus_areas)
        
        if not improvements:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate improvements"
            )
        
        return ResumeImprovementResponse(
            improved_sections=improvements.get("improved_sections", {}),
            suggestions=improvements.get("suggestions", []),
            overall_improvements=improvements.get("overall_improvements", "")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Improvement generation failed: {str(e)}"
        )


@app.post("/api/resume/ask", response_model=QuestionResponse, tags=["Resume"])
async def ask_resume_question(
    request: QuestionRequest,
    resume_id: Optional[int] = None,
    user_id: int = Query(default=1, description="User ID"),
    agent: ResumeAnalysisAgent = Depends(get_user_agent)
):
    """
    Ask questions about the resume
    
    - **question**: Question to ask about the resume
    - **chat_history**: Optional chat history for context
    - **resume_id**: Optional resume ID
    - **user_id**: User ID (default: 1)
    """
    try:
        
        # Get resume text
        cached = user_analysis_cache.get(user_id)
        if cached:
            agent.resume_text = cached.get("resume_text")
        else:
            if resume_id:
                resume_data = get_user_resume_by_id(user_id, resume_id)
            else:
                all_resumes = get_user_resumes(user_id)
                if not all_resumes:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="No resume found"
                    )
                latest_id = all_resumes[0].get("id") if isinstance(all_resumes[0], dict) else all_resumes[0]
                resume_data = get_user_resume_by_id(user_id, latest_id)
            
            if not resume_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found"
                )
            
            agent.resume_text = resume_data.get("resume_text", "")
        
        # Answer question
        answer = agent.ask_question(
            question=request.question,
            chat_history=request.chat_history
        )
        
        return QuestionResponse(
            answer=answer,
            context_used=True
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Question answering failed: {str(e)}"
        )


# ==================== INTERVIEW ROUTES ====================

@app.post("/api/interview/start", response_model=InterviewStartResponse, tags=["Interview"])
async def start_interview(
    request: InterviewStartRequest,
    resume_id: Optional[int] = None,
    user_id: int = Query(default=1, description="User ID"),
    agent: ResumeAnalysisAgent = Depends(get_user_agent)
):
    """
    Start a new mock interview
    
    - **question_types**: List of question types (Technical, Behavioral, etc.)
    - **difficulty**: Difficulty level (Easy, Medium, Hard)
    - **num_questions**: Number of questions (1-20)
    - **max_duration_minutes**: Maximum interview duration
    - **resume_id**: Optional resume ID
    - **user_id**: User ID (default: 1)
    """
    try:
        
        # Get resume text
        if resume_id:
            resume_data = get_user_resume_by_id(user_id, resume_id)
        else:
            all_resumes = get_user_resumes(user_id)
            if not all_resumes:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No resume found"
                )
            latest_id = all_resumes[0].get("id") if isinstance(all_resumes[0], dict) else all_resumes[0]
            resume_data = get_user_resume_by_id(user_id, latest_id)
        
        if not resume_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found"
            )
        
        resume_text = resume_data.get("resume_text", "")
        agent.resume_text = resume_text
        
        # Ensure analysis context is available
        cached = user_analysis_cache.get(user_id)
        if cached and cached.get("resume_text") == resume_text:
            agent.analysis_result = cached.get("analysis")
        
        # Extract skills if needed
        if not getattr(agent, "extracted_skills", None):
            skills = []
            if agent.analysis_result:
                skill_scores = agent.analysis_result.get("skill_scores", {})
                if skill_scores:
                    skills = list(skill_scores.keys())
            agent.extracted_skills = skills
        
        # Generate interview questions
        questions = agent.generate_interview_questions(
            question_types=[qt.value for qt in request.question_types],
            difficulty=request.difficulty.value,
            num_questions=request.num_questions
        )
        
        if not questions:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate interview questions"
            )
        
        # Normalize questions
        normalized_questions = []
        for q in questions:
            if isinstance(q, dict):
                normalized_questions.append(q.get("question") or q.get("text") or str(q))
            else:
                normalized_questions.append(str(q))
        
        # Create interview session
        interview_id = str(uuid.uuid4())
        start_time = datetime.utcnow()
        
        interview_session = {
            "interview_id": interview_id,
            "user_id": user_id,
            "resume_text": resume_text,
            "questions": normalized_questions[:request.num_questions],
            "question_types": [qt.value for qt in request.question_types],
            "difficulty": request.difficulty.value,
            "current_question": 0,
            "answers": [],
            "transcripts": [],
            "scores": [],
            "start_time": start_time.isoformat(),
            "max_duration_seconds": request.max_duration_minutes * 60,
            "completed": False,
        }
        
        active_interviews[interview_id] = interview_session
        
        # Format response
        question_list = [
            InterviewQuestion(
                question_id=i,
                question_text=q,
                question_type=request.question_types[i % len(request.question_types)]
            )
            for i, q in enumerate(normalized_questions[:request.num_questions])
        ]
        
        return InterviewStartResponse(
            interview_id=interview_id,
            questions=question_list,
            max_duration_seconds=interview_session["max_duration_seconds"],
            start_time=start_time
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start interview: {str(e)}"
        )


@app.post("/api/interview/submit", response_model=AnswerSubmissionResponse, tags=["Interview"])
async def submit_answer(
    interview_id: str,
    submission: AnswerSubmission,
    user_id: int = Query(default=1, description="User ID"),
    agent: ResumeAnalysisAgent = Depends(get_user_agent)
):
    """
    Submit an answer to an interview question
    
    - **interview_id**: Interview session ID
    - **question_id**: Question ID
    - **transcript**: Answer transcript
    - **audio_duration**: Optional audio duration
    - **user_id**: User ID (default: 1)
    """
    try:
        # Get interview session
        interview = active_interviews.get(interview_id)
        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview session not found"
            )
        
        # Get question
        if submission.question_id >= len(interview["questions"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid question ID"
            )
        
        question_text = interview["questions"][submission.question_id]
        
        # Score the answer
        agent.resume_text = interview["resume_text"]
        score = agent.score_interview_answer(
            question=question_text,
            answer=submission.transcript
        )
        
        # Store answer and score
        interview["answers"].append(submission.transcript)
        interview["transcripts"].append(submission.transcript)
        interview["scores"].append(score)
        interview["current_question"] = submission.question_id + 1
        
        # Check if interview is complete
        next_question_id = None
        if interview["current_question"] < len(interview["questions"]):
            next_question_id = interview["current_question"]
        else:
            interview["completed"] = True
        
        return AnswerSubmissionResponse(
            question_id=submission.question_id,
            scores=AnswerScore(
                communication=score.get("communication", 7.0),
                technical_knowledge=score.get("technical_knowledge", 7.0),
                problem_solving=score.get("problem_solving", 7.0),
                overall=score.get("overall", 7.0),
                feedback=score.get("feedback", "Good answer!")
            ),
            next_question_id=next_question_id,
            follow_up_question=None
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Answer submission failed: {str(e)}"
        )


@app.get("/api/interview/summary/{interview_id}", response_model=InterviewSummary, tags=["Interview"])
async def get_interview_summary(
    interview_id: str,
    user_id: int = Query(default=1, description="User ID")
):
    """
    Get interview summary and final feedback
    
    - **interview_id**: Interview session ID
    - **user_id**: User ID (default: 1)
    """
    try:
        # Get interview session
        interview = active_interviews.get(interview_id)
        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview session not found"
            )
        
        # Calculate averages
        scores = interview["scores"]
        if not scores:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No answers submitted yet"
            )
        
        avg_communication = sum(s.get("communication", 0) for s in scores) / len(scores)
        avg_technical = sum(s.get("technical_knowledge", 0) for s in scores) / len(scores)
        avg_problem_solving = sum(s.get("problem_solving", 0) for s in scores) / len(scores)
        overall_score = sum(s.get("overall", 0) for s in scores) / len(scores)
        
        # Determine decision
        if overall_score >= 8.0:
            decision = "Strong Hire"
        elif overall_score >= 6.5:
            decision = "Hire"
        elif overall_score >= 5.0:
            decision = "Maybe"
        else:
            decision = "No Hire"
        
        # Generate feedback
        detailed_feedback = (
            f"You answered {len(scores)} out of {len(interview['questions'])} questions. "
            f"Your overall performance was {'excellent' if overall_score >= 8 else 'good' if overall_score >= 6 else 'fair'}. "
            f"Keep practicing to improve your interview skills!"
        )
        
        # Extract strengths and improvements
        strengths = []
        improvements = []
        
        if avg_communication >= 7:
            strengths.append("Clear communication skills")
        else:
            improvements.append("Work on articulating your thoughts more clearly")
        
        if avg_technical >= 7:
            strengths.append("Strong technical knowledge")
        else:
            improvements.append("Deepen your technical knowledge in key areas")
        
        if avg_problem_solving >= 7:
            strengths.append("Good problem-solving approach")
        else:
            improvements.append("Practice breaking down complex problems systematically")
        
        return InterviewSummary(
            total_questions=len(interview["questions"]),
            answered_questions=len(scores),
            average_communication=round(avg_communication, 2),
            average_technical=round(avg_technical, 2),
            average_problem_solving=round(avg_problem_solving, 2),
            overall_score=round(overall_score, 2),
            decision=decision,
            detailed_feedback=detailed_feedback,
            strengths=strengths,
            areas_for_improvement=improvements
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate summary: {str(e)}"
        )


# ==================== JOB SEARCH ROUTES ====================

@app.post("/api/jobs/search", response_model=JobSearchResponse, tags=["Job Search"])
async def search_jobs(
    request: JobSearchRequest,
    platform: str = Query(default="adzuna", description="Job platform: adzuna | jooble"),
    user_id: int = Query(default=1, description="User ID")
):
    """
    Search for jobs on various platforms
    
    - **query**: Job search query (keywords, title)
    - **location**: Location for job search
    - **max_results**: Maximum number of results (1-50)
    - **platform**: Job platform (adzuna or jooble)
    - **user_id**: User ID (default: 1)
    """
    try:
        # Get user settings for API keys
        settings = get_user_settings(user_id) or {}
        
        jooble_api_key = settings.get("jooble_api_key") or os.getenv("JOOBLE_API_KEY")
        
        # Create job agent
        job_agent = JobAgent(jooble_api_key=jooble_api_key)
        
        # Search jobs
        if platform.lower() == "jooble" and jooble_api_key:
            jobs = job_agent.search_jooble(
                query=request.query or "",
                location=request.location or "",
                max_results=request.max_results
            )
        else:
            # Default to Adzuna (no API key needed for basic search)
            jobs = job_agent.search_adzuna(
                query=request.query or "",
                location=request.location or "",
                max_results=request.max_results
            )
        
        # Format response
        listings = []
        for job in jobs or []:
            if "error" in job:
                continue
            listings.append(
                JobListing(
                    title=job.get("title", ""),
                    company=job.get("company", ""),
                    location=job.get("location", ""),
                    description=job.get("description", ""),
                    url=job.get("link") or job.get("url"),
                    posted_date=job.get("posted_date")
                )
            )
        
        return JobSearchResponse(
            jobs=listings,
            total_found=len(listings)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job search failed: {str(e)}"
        )


# ==================== ERROR HANDLERS ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc),
            "status_code": 500
        }
    )


# ==================== STARTUP MESSAGE ====================

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║          🤖 ResuMate FastAPI Backend v1.0.0             ║
    ║                                                          ║
    ║  AI-Powered Resume Tracking & Mock Interview System      ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝
    
    📚 API Documentation: http://{host}:{port}/docs
    🔍 ReDoc: http://{host}:{port}/redoc
    🌐 API Base URL: http://{host}:{port}
    
    Features:
    ✅ User Authentication (JWT)
    ✅ Resume Upload & Analysis
    ✅ AI-Powered Resume Improvement
    ✅ Mock Interview with Q&A
    ✅ Job Search Integration
    ✅ Smart Recommendations
    
    Starting server...
    """)
    
    uvicorn.run(
        "backend:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
