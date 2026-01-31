import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';

const router = Router();

// Search jobs
router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, location, max_results = 10 } = req.body;
    const platform = req.query.platform as string || 'adzuna';

    // Simple job search implementation
    // In production, you'd integrate with actual job APIs
    const jobs: any[] = [];

    if (platform === 'jooble' && process.env.JOOBLE_API_KEY) {
      try {
        const response = await axios.post(
          'https://jooble.org/api/' + process.env.JOOBLE_API_KEY,
          {
            keywords: query,
            location: location
          }
        );
        
        const joobleJobs = response.data.jobs || [];
        jobs.push(...joobleJobs.slice(0, max_results).map((job: any) => ({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.snippet,
          url: job.link,
          posted_date: job.updated
        })));
      } catch (error) {
        console.error('Jooble API error:', error);
      }
    }

    res.json({
      jobs,
      total_found: jobs.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
