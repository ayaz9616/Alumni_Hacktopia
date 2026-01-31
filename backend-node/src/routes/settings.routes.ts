import { Router, Request, Response, NextFunction } from 'express';
import UserSettings from '../models/UserSettings';

const router = Router();

// Get settings
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.user_id as string || '1';
    
    const userSettings = await UserSettings.findOne({ user_id: userId });
    
    if (!userSettings) {
      res.json({
        provider: 'groq',
        api_key: null,
        model: null,
        ollama_base_url: 'http://localhost:11434',
        ollama_model: 'llama3.1:8b'
      });
      return;
    }

    res.json(userSettings.settings);
  } catch (error) {
    next(error);
  }
});

// Update settings
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.user_id as string || '1';
    const settings = req.body;

    await UserSettings.findOneAndUpdate(
      { user_id: userId },
      { settings, updated_at: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
