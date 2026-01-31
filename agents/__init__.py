"""Agent modules for Resume Tracking and AI Mock Interview system."""

from .resume_analyzer import ResumeAnalyzer
from .interview_agent import InterviewAgent
from .resume_improver import ResumeImprover
from .job_search_agent import JobAgent

# Import LLM functions for backward compatibility
from utils.llm_providers import groq_chat, SESSION
from utils.text_utils import clamp_text as _clamp_text


class ResumeAnalysisAgent(ResumeAnalyzer):
    """Backward compatible wrapper combining all agent functionality."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize sub-agents
        self._interview_agent = None
        self._improver_agent = None
    
    @property
    def interview_agent(self):
        """Lazy-load interview agent."""
        if self._interview_agent is None:
            self._interview_agent = InterviewAgent(self)
        return self._interview_agent
    
    @property
    def improver_agent(self):
        """Lazy-load improver agent."""
        if self._improver_agent is None:
            self._improver_agent = ResumeImprover(self)
        return self._improver_agent
    
    # Backend API compatibility methods
    def analyze_resume(self, role=None, cutoff_score=75, jd_text=None, custom_skills=None):
        """
        Analyze resume with backend-compatible API.
        
        Args:
            role: Target job role (used as context)
            cutoff_score: Minimum matching score threshold
            jd_text: Job description text
            custom_skills: List of required skills
        """
        # Determine role requirements
        role_requirements = custom_skills if custom_skills else None
        
        # Call the parent's analyze_resume_text method since resume_text is already set
        if hasattr(self, 'resume_text') and self.resume_text:
            result = self.analyze_resume_text(
                resume_text=self.resume_text,
                role_requirements=role_requirements,
                custom_jd=jd_text,
                quick=False
            )
        else:
            raise ValueError("Resume text must be set before calling analyze_resume")
        
        # Add cutoff_score to result for filtering
        if result:
            result['cutoff_score'] = cutoff_score
            result['role'] = role
        
        return result
    
    def suggest_improvements(self, focus_areas=None):
        """Generate resume improvement suggestions."""
        # If no focus areas provided, use default comprehensive areas
        if not focus_areas or len(focus_areas) == 0:
            focus_areas = [
                "Skills Highlighting",
                "Achievement Quantification", 
                "Professional Summary",
                "Work Experience Impact",
                "Technical Skills Presentation"
            ]
        
        improvements = self.improver_agent.improve_resume(
            improvement_areas=focus_areas,
            target_role=""
        )
        
        # Transform to backend-expected format
        if not improvements or len(improvements) == 0:
            return {
                "improved_sections": {},
                "suggestions": ["No specific improvements identified at this time."],
                "overall_improvements": "Continue to refine your resume based on target role requirements."
            }
        
        # Extract all specific suggestions
        all_suggestions = []
        for area, details in improvements.items():
            if isinstance(details, dict):
                if details.get("specific"):
                    all_suggestions.extend(details["specific"])
                elif details.get("description"):
                    all_suggestions.append(details["description"])
        
        # Generate overall summary
        overall = f"Focus on improving {len(improvements)} key areas: {', '.join(improvements.keys())}. "
        overall += "Implement the specific suggestions to enhance your resume's impact and alignment with target roles."
        
        return {
            "improved_sections": improvements,
            "suggestions": all_suggestions if all_suggestions else ["Review and enhance key sections of your resume."],
            "overall_improvements": overall
        }
    
    def score_interview_answer(self, question, answer):
        """Score an interview answer."""
        return self.interview_agent.score_interview_answer(question, answer)
    
    # Delegate methods to sub-agents for backward compatibility
    def ask_question(self, question, chat_history=None):
        """Delegate to interview agent."""
        return self.interview_agent.ask_question(question, chat_history)
    
    def answer_interview_question(self, question: str) -> str:
        """Delegate to interview agent."""
        return self.interview_agent.answer_interview_question(question)
    
    def generate_interview_questions(self, question_types, difficulty, num_questions):
        """Delegate to interview agent."""
        return self.interview_agent.generate_interview_questions(question_types, difficulty, num_questions)
    
    def improve_resume(self, improvement_areas, target_role=""):
        """Delegate to improver agent."""
        return self.improver_agent.improve_resume(improvement_areas, target_role)
    
    def get_improved_resume(self, target_role="", highlight_skills=""):
        """Delegate to improver agent."""
        return self.improver_agent.get_improved_resume(target_role, highlight_skills)
    
    def generate_cover_letter(self, company: str, role: str, job_description: str = "", 
                            tone: str = "professional", length: str = "one-page") -> str:
        """Delegate to improver agent."""
        return self.improver_agent.generate_cover_letter(company, role, job_description, tone, length)
    
    def generate_updated_resume_latex(self, latex_source: str, job_description: str) -> str:
        """Delegate to improver agent."""
        return self.improver_agent.generate_updated_resume_latex(latex_source, job_description)
    
    def cleanup(self):
        """Delegate to improver agent."""
        return self.improver_agent.cleanup()


__all__ = [
    'ResumeAnalyzer',
    'InterviewAgent', 
    'ResumeImprover',
    'JobAgent',
    'ResumeAnalysisAgent',  # Backward compatibility
    # LLM functions for backward compatibility
    'groq_chat',
    'SESSION',
    '_clamp_text',
]
