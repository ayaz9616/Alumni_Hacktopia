import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import Resume from '../models/Resume';
import { extractTextFromFile } from '../utils/fileHandler';
import { ResumeAnalysisAgent } from '../agents/ResumeAnalysisAgent';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Upload resume
router.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    const file = req.file;

    if (!file) {
      res.status(400).json({ detail: 'No file uploaded' });
      return;
    }

    // Validate file type
    if (!file.originalname.toLowerCase().match(/\.(pdf|txt)$/)) {
      res.status(400).json({ detail: 'Only PDF and TXT files are supported' });
      return;
    }

    // Extract text
    const resumeText = await extractTextFromFile(file.buffer, file.originalname);

    if (!resumeText || resumeText.trim().length < 50) {
      res.status(400).json({ detail: 'Resume text is too short or empty' });
      return;
    }

    // Save to database
    const resumeHash = crypto.createHash('sha256').update(resumeText).digest('hex');

    // Try to find existing resume
    let resume = await Resume.findOne({ user_id: userId, resume_hash: resumeHash });

    if (!resume) {
      resume = await Resume.create({
        user_id: userId,
        filename: file.originalname,
        resume_hash: resumeHash,
        resume_text: resumeText
      });
    }

    const preview = resumeText.length > 500 ? resumeText.substring(0, 500) + '...' : resumeText;

    res.json({
      message: 'Resume uploaded successfully',
      resume_id: resume._id.toString(),
      text_preview: preview
    });
  } catch (error) {
    next(error);
  }
});

// List resumes
router.get('/list', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    
    const resumes = await Resume.find({ user_id: userId })
      .select('_id filename resume_hash created_at')
      .sort({ created_at: -1 });

    res.json({
      resumes: resumes.map(r => ({
        id: r._id.toString(),
        filename: r.filename,
        resume_hash: r.resume_hash,
        created_at: r.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Analyze resume
router.post('/analyze', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    const resumeId = req.body.resume_id as string | undefined;
    const { role, cutoff_score = 75, jd_text, custom_skills } = req.body;

    // Get resume text
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

    // Create agent and analyze
    const agent = new ResumeAnalysisAgent({
      apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
      provider: 'groq'
    });

    const result = await agent.analyzeResume({
      resumeText: resumeData.resume_text,
      role,
      cutoffScore: cutoff_score,
      jdText: jd_text,
      customSkills: custom_skills
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Improve resume
router.post('/improve', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    const resumeId = req.body.resume_id as string | undefined;
    const { focus_areas } = req.body;

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

    // Create agent and generate improvements
    const agent = new ResumeAnalysisAgent({
      apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
      provider: 'groq'
    });

    const improvements = await agent.suggestImprovements({
      resumeText: resumeData.resume_text,
      focusAreas: focus_areas
    });

    res.json(improvements);
  } catch (error) {
    next(error);
  }
});

// Ask question about resume
router.post('/ask', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    const resumeId = req.body.resume_id as string | undefined;
    const { question, chat_history } = req.body;

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

    // Create agent and answer question
    const agent = new ResumeAnalysisAgent({
      apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
      provider: 'groq'
    });

    const answer = await agent.askQuestion({
      resumeText: resumeData.resume_text,
      question,
      chatHistory: chat_history
    });

    res.json({
      answer,
      context_used: true
    });
  } catch (error) {
    next(error);
  }
});

export default router;
