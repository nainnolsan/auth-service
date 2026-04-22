import { Router } from 'express';
import { updateScrapingPreferences, getAllScrapingPreferences } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Endpoint for the React Frontend to save config
router.put('/preferences', authenticateToken, updateScrapingPreferences);

// Internal Endpoint for `job-scraper-service` to fetch what it needs to query
router.get('/internal/preferences/all', getAllScrapingPreferences);

export default router;
