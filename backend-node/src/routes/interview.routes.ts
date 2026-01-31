import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Resume from '../models/Resume';
import { ResumeAnalysisAgent } from '../agents/ResumeAnalysisAgent';

const router = Router();
const activeInterviews: Map<string, any> = new Map();

// Start interview
router.post('/start', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    const resumeId = req.body.resume_id as string | undefined;
    const { question_types, difficulty, num_questions, max_duration_minutes } = req.body;

    // Get resume
    let resumeData;
    if (resumeId) {
      resumeData = await Resume.findOne({ _id: resumeId, user_id: userId });
    } else {
      resumeData = await Resume.findOne({ user_id: userId }).sort({ created_at: -1 });
    }

    if (!resumeData) {
      res.status(404).json({ detail: 'Resume not found' });
      return;
    }

    // Create agent
    const agent = new ResumeAnalysisAgent({
      apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
      provider: 'groq'
    });

    // Generate questions
    const questions = await agent.generateInterviewQuestions({
      resumeText: resumeData.resume_text,
      questionTypes: question_types,
      difficulty,
      numQuestions: num_questions
    });

    // Create interview session
    const interviewId = uuidv4();
    const startTime = new Date();

    const session = {
      interview_id: interviewId,
      user_id: userId,
      resume_text: resumeData.resume_text,
      questions: questions.slice(0, num_questions),
      question_types,
      difficulty,
      current_question: 0,
      answers: [],
      scores: [],
      start_time: startTime.toISOString(),
      max_duration_seconds: max_duration_minutes * 60,
      completed: false
    };

    activeInterviews.set(interviewId, session);

    res.json({
      interview_id: interviewId,
      questions: questions.slice(0, num_questions).map((q: string, i: number) => ({
        question_id: i,
        question_text: q,
        question_type: question_types[i % question_types.length]
      })),
      max_duration_seconds: session.max_duration_seconds,
      start_time: startTime
    });
  } catch (error) {
    return next(error);
  }
});

// Submit answer
router.post('/submit', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { interview_id } = req.query;
    const { question_id, transcript } = req.body;

    const interview = activeInterviews.get(interview_id as string);
    if (!interview) {
      res.status(404).json({ detail: 'Interview session not found' });
      return;
    }

    if (question_id >= interview.questions.length) {
      res.status(400).json({ detail: 'Invalid question ID' });
      return;
    }

    const questionText = interview.questions[question_id];

    // Create agent and score answer
    const agent = new ResumeAnalysisAgent({
      apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
      provider: 'groq'
    });

    const score = await agent.scoreInterviewAnswer({
      question: questionText,
      answer: transcript
    });

    interview.answers.push(transcript);
    interview.scores.push(score);
    interview.current_question = question_id + 1;

    const nextQuestionId = interview.current_question < interview.questions.length 
      ? interview.current_question 
      : null;

    if (!nextQuestionId) {
      interview.completed = true;
    }

    res.json({
      question_id,
      scores: {
        communication: score.communication || 7.0,
        technical_knowledge: score.technical_knowledge || 7.0,
        problem_solving: score.problem_solving || 7.0,
        overall: score.overall || 7.0,
        feedback: score.feedback || 'Good answer!'
      },
      next_question_id: nextQuestionId,
      follow_up_question: null
    });
  } catch (error) {
    return next(error);
  }
});

// Get summary
router.get('/summary/:interview_id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { interview_id } = req.params;

    const interview = activeInterviews.get(interview_id);
    if (!interview) {
      res.status(404).json({ detail: 'Interview session not found' });
      return;
    }

    if (interview.scores.length === 0) {
      res.status(400).json({ detail: 'No answers submitted yet' });
      return;
    }

    const avgCommunication = interview.scores.reduce((sum: number, s: any) => sum + (s.communication || 0), 0) / interview.scores.length;
    const avgTechnical = interview.scores.reduce((sum: number, s: any) => sum + (s.technical_knowledge || 0), 0) / interview.scores.length;
    const avgProblemSolving = interview.scores.reduce((sum: number, s: any) => sum + (s.problem_solving || 0), 0) / interview.scores.length;
    const overallScore = interview.scores.reduce((sum: number, s: any) => sum + (s.overall || 0), 0) / interview.scores.length;

    let decision = 'No Hire';
    if (overallScore >= 8.0) decision = 'Strong Hire';
    else if (overallScore >= 6.5) decision = 'Hire';
    else if (overallScore >= 5.0) decision = 'Maybe';

    res.json({
      total_questions: interview.questions.length,
      answered_questions: interview.scores.length,
      average_communication: Math.round(avgCommunication * 100) / 100,
      average_technical: Math.round(avgTechnical * 100) / 100,
      average_problem_solving: Math.round(avgProblemSolving * 100) / 100,
      overall_score: Math.round(overallScore * 100) / 100,
      decision,
      detailed_feedback: `You answered ${interview.scores.length} out of ${interview.questions.length} questions.`,
      strengths: avgCommunication >= 7 ? ['Clear communication skills'] : [],
      areas_for_improvement: avgCommunication < 7 ? ['Work on articulating your thoughts more clearly'] : []
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
